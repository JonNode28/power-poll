import {getUpdatedSubject} from "../../utility/getUpdatedSubject.js";
import {MapSubject, MapSubjectValue, MapSubjectValueReason} from "./MapSubject.js";
import {PercentSubject} from "../percent/PercentSubject.js";
import {UpdateFn} from "../SubjectTypeDefinition.js";
import {isRejected} from "../../Subject.js";
import {generateStatusWithReason} from "../../status/generateStatusWithReason.js";
import {getEngagementThresholdMetStatusAndReason} from "../../status/getEngagementThresholdMetStatusAndReason.js";

interface CountItem {
  subjectId: string,
  count: {
    votes: number,
    score: number
  }
}

const renderItemCounts = (items: CountItem[], totalVoteCount: number) => items.map((item, i) => `#${i + 1} ${item.subjectId} (consensus: ${Math.round((item.count.votes / totalVoteCount) * 100)}%, score: ${item.count.score})`)

export const update: UpdateFn<MapSubject, typeof MapSubjectValue, typeof MapSubjectValueReason> = async (
  subject,
  updateId,
  dependencyChain
) => {
  const engagementThresholdSubject = (await getUpdatedSubject(subject.engagementInput, PercentSubject, updateId, dependencyChain))
  const consensusThresholdSubject = (await getUpdatedSubject(subject.consensusInput, PercentSubject, updateId, dependencyChain))

  const allVotes = Object.values(subject.votes)
  const counts = allVotes.reduce<Record<string, Record<string, number>>>((a, c) => {
    if(isRejected(c)) return a
    Object.entries(c.value).forEach(([ key, subjectId ]) => {
      if(!a[key]) a[key] = { [subjectId]: 1 }
      else if(!a[key][subjectId]) a[key][subjectId] = 1
      else a[key][subjectId]++
    })
    return a
  },{})

  const consensusVotesThreshold = consensusThresholdSubject?.value ? allVotes.length * (consensusThresholdSubject.value / 100) : 0;

  const { value, valueReason } = Object.entries(counts).reduce<{ value: Record<string, string>, valueReason: string[] }>((a, [ key, subjectCounts ]) => {
    const sortedSubjectCounts = Object.entries(subjectCounts)
      .sort(([, countA], [, countB]) => countB - countA)

    const consensusSubjects = sortedSubjectCounts
      .filter(([,count]) => count > consensusVotesThreshold)

    const winner = consensusSubjects.pop()
    if(winner){
      const subjectId = winner[0]
      const count = winner[1]
      a.value[key] = subjectId
      a.valueReason.push(`Property "${key}" set to ${subjectId} because it had the most votes (${count}) and met consensus threshold of ${consensusThresholdSubject?.value}% with ${count / allVotes.length * 100}% agreeing this value`)
    }
    for(const [ subjectId, subjectCount ] of sortedSubjectCounts){
      if(winner && winner[0] === subjectId) continue
      const consensus = subjectCount / allVotes.length * 100
      const reasonSegments = [`Property "${key}" was not set to ${subjectId} because`]
      if(winner){
        if(subjectCount > consensusVotesThreshold) reasonSegments.push(`while it did meet the consensus threshold of ${consensusThresholdSubject?.value}% with ${consensus}%, it didn't have the most votes: ${subjectCount} vs ${winner[0]} with ${winner[1]} votes`)
        else if(subjectCount < winner[1]) reasonSegments.push(`it didn't have the most votes (${subjectCount} vs ${winner[0]} with ${winner[1]} votes) and it also it didn't meet the consensus threshold of ${consensusThresholdSubject?.value} having only ${consensus}%`)
        else throw new Error('Should not happen')
      } else {
        if(subjectCount < consensusVotesThreshold) reasonSegments.push(`it didn't meet the consensus threshold of ${consensusThresholdSubject?.value}% having only ${consensus}%`)
        else throw new Error('Should not happen')
      }
      a.valueReason.push(reasonSegments.join())
    }
    return a
  }, {
    value: {},
    valueReason: []
  })

  const { status, reason } = await generateStatusWithReason(subject, [
    () => getEngagementThresholdMetStatusAndReason(allVotes.length, engagementThresholdSubject)
  ])

  return {
    ...subject,
    value,
    valueReason,
    status: status,
    statusReason: reason
  }
}