import {getUpdatedInputSubject} from "../../getUpdatedInputSubject.js";
import {TextSubject, TextSubjectVote} from "./TextSubject.js";
import {PercentSubject} from "../percent/PercentSubject.js";
import {UpdateFn} from "../SubjectTypeDefinition.js";
import {getEngagementThresholdMetStatusAndReason} from "../../getEngagementThresholdMetStatusAndReason.js";
import {generateStatusWithReason} from "../../generateStatusWithReason.js";

export const update: UpdateFn<typeof TextSubject> = async (subject, updatedSubjects) => {

  const engagementThresholdSubject = (await getUpdatedInputSubject(subject.inputs?.engagement, PercentSubject, updatedSubjects))
  const consensusThresholdSubject = (await getUpdatedInputSubject(subject.inputs?.consensus, PercentSubject, updatedSubjects))

  const allVotes = Object.values(subject.votes)
  const counts = allVotes.reduce<Record<string, number>>((runningTotal, vote) => {
    const key = vote.value.toLowerCase().trim()
    const count = runningTotal[key]
    if(typeof count === 'undefined') runningTotal[key] = 1
    else runningTotal[key] = count + 1
    return runningTotal
  },{})

  const sortedCounts = Object.entries(counts)
    .sort(([, countA], [, countB]) => countB - countA)
  const topKeyCountItem = sortedCounts[0]

  const { status, reason } = await generateStatusWithReason([
    () => getEngagementThresholdMetStatusAndReason(allVotes.length, engagementThresholdSubject),
    () => {
      if(!sortedCounts.length) return { status: 'pending', reason: 'No votes yet' }
      const [ topKey, topKeyCount ] = topKeyCountItem
      const topKeyConsensus = (topKeyCount / allVotes.length) * 100
      if(!consensusThresholdSubject) return { status: 'active', reason: 'No consensus threshold subject supplied' }
      if(consensusThresholdSubject.status !== 'active') return { status: 'pending', reason: `Consensus threshold subject has "${consensusThresholdSubject.status}" status` }
      if(consensusThresholdSubject.value > topKeyConsensus) return { status: 'pending', reason: `Consensus threshold of ${Math.round(consensusThresholdSubject.value)}% not met. Highest is ${Math.round(topKeyConsensus)}% for "${topKey}"`}
      return { status: 'active', reason: `Consensus threshold of ${Math.round(consensusThresholdSubject.value)}% met by "${topKey}" with consensus of ${Math.round(topKeyConsensus)}%"`}
    }
  ])

  return {
    ...subject,
    value: topKeyCountItem ? topKeyCountItem[0] : undefined,
    status: status,
    statusReason: reason
  }
}
