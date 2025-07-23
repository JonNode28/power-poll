import {getUpdatedInputSubject} from "../../getUpdatedInputSubject.js";
import {TextSubject, TextSubjectVote} from "./TextSubject.js";
import {PercentSubject} from "../percent/PercentSubject.js";
import {UpdateFn} from "../SubjectTypeDefinition.js";
import {engagementThresholdMet} from "../../engagementThresholdMet.js";

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
  const [ topKey, topKeyCount ] = sortedCounts[0]

  const topKeyConsensus = (topKeyCount / allVotes.length) * 100
  const topKeyConsensusThresholdMet = !consensusThresholdSubject || (consensusThresholdSubject.status === 'active' && topKeyConsensus > consensusThresholdSubject.value)


  return {
    ...subject,
    value: topKey,
    status: await engagementThresholdMet(allVotes.length, engagementThresholdSubject) && topKeyConsensusThresholdMet ? 'active' : 'pending'
  }
}
