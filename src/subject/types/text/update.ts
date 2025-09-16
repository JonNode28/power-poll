import {getUpdatedSubject} from "../../utility/getUpdatedSubject.js";
import {TextSubject} from "./TextSubject.js";
import {PercentSubject} from "../percent/PercentSubject.js";
import {UpdateFn} from "../SubjectTypeDefinition.js";
import {isRejected} from "../../Subject.js";
import {ZodType} from "zod";
import {getValidationStatusAndReason} from "../../status/getValidationStatusAndReason.js";
import {generateStatusWithReason} from "../../status/generateStatusWithReason.js";
import {getEngagementThresholdMetStatusAndReason} from "../../status/getEngagementThresholdMetStatusAndReason.js";

export const update: UpdateFn<TextSubject, ZodType<string>, ZodType<string>> = async (
  subject,
  updateId,
  dependencyChain
) => {
  const engagementThresholdSubject = (await getUpdatedSubject(subject.engagementInput, PercentSubject, updateId, dependencyChain))
  const consensusThresholdSubject = (await getUpdatedSubject(subject.consensusInput, PercentSubject, updateId, dependencyChain))

  const allVotes = Object.values(subject.votes)
  const counts = allVotes.reduce<Record<string, number>>((runningTotal, vote) => {
    if(isRejected(vote)) return runningTotal // A rejected vote
    const key = vote.value.toLowerCase().trim()
    const count = runningTotal[key]
    if(typeof count === 'undefined') runningTotal[key] = 1
    else runningTotal[key] = count + 1
    return runningTotal
  },{})

  const sortedCounts = Object.entries(counts)
    .sort(([, countA], [, countB]) => countB - countA)
  const topKeyCountItem = sortedCounts[0]
  const value = topKeyCountItem ? topKeyCountItem[0] : undefined

  const updatedSubject = {
    ...subject,
    value,
    valueReason: `votes by popularity: ${sortedCounts.map(([ value, count ], i) => `#${i + 1} ${value} (${count})`).join(',')}`,
  }

  const { status, reason } = await generateStatusWithReason(updatedSubject, [
    () => getEngagementThresholdMetStatusAndReason(allVotes.length, engagementThresholdSubject),
    () => getValidationStatusAndReason(updatedSubject, updatedSubject.structureInput, updateId, dependencyChain),
    () => {
      if(!consensusThresholdSubject) return { status: 'active', reason: 'No consensus threshold subject supplied' }
      if(!sortedCounts.length) return { status: 'pending', reason: 'No votes yet' }
      const [ topKey, topKeyCount ] = topKeyCountItem
      const topKeyConsensus = (topKeyCount / allVotes.length) * 100
      if(consensusThresholdSubject.status !== 'active') return { status: 'pending', reason: `Consensus threshold subject has "${consensusThresholdSubject.status}" status` }
      if(consensusThresholdSubject.value === undefined) return { status: 'pending', reason: `Consensus threshold subject no value` }
      if(consensusThresholdSubject.value > topKeyConsensus) return { status: 'pending', reason: `Consensus threshold of ${Math.round(consensusThresholdSubject.value)}% not met. Highest is ${Math.round(topKeyConsensus)}% for "${topKey}"`}
      return { status: 'active', reason: `Consensus threshold of ${Math.round(consensusThresholdSubject.value)}% met by "${topKey}" with consensus of ${Math.round(topKeyConsensus)}%"`}
    }
  ])

  updatedSubject.status = status
  updatedSubject.statusReason = reason

  return updatedSubject
}
