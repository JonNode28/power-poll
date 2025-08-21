import {getUpdatedInputSubject} from "../../getUpdatedInputSubject.js";
import {ListSubject, ListSubjectValue, ListSubjectValueReason} from "./ListSubject.js";
import {PercentSubject} from "../percent/PercentSubject.js";
import {UpdateFn} from "../SubjectTypeDefinition.js";
import {getEngagementThresholdMetStatusAndReason} from "../../getEngagementThresholdMetStatusAndReason.js";
import {generateStatusWithReason} from "../../generateStatusWithReason.js";
import {isRejected} from "../../Subject.js";

interface CountItem {
  subjectId: string,
  count: {
    votes: number,
    score: number
  }
}

const renderItemCounts = (items: CountItem[], totalVoteCount: number) => items.map((item, i) => `#${i + 1} ${item.subjectId} (consensus: ${Math.round((item.count.votes / totalVoteCount) * 100)}%, score: ${item.count.score})`).join(', ')

export const update: UpdateFn<ListSubject, typeof ListSubjectValue, typeof ListSubjectValueReason> = async (subject, updatedSubjects) => {
  const engagementThresholdSubject = (await getUpdatedInputSubject(subject.inputs?.engagement, PercentSubject, updatedSubjects))
  const consensusThresholdSubject = (await getUpdatedInputSubject(subject.inputs?.consensus, PercentSubject, updatedSubjects))

  const allVotes = Object.values(subject.votes)
  const counts = allVotes.reduce<Record<string, { votes: number, score: number}>>((a, c) => {
    if(isRejected(c)) return a
    c.value.forEach((subjectId, i) => {
      const count = a[subjectId]
      if(!count) a[subjectId] = {
        votes: 1, score: i
      }
      else {
        count.votes++
        count.score += i
      }
    })
    return a
  },{})

  const consensusVotesThreshold = consensusThresholdSubject?.value ? allVotes.length * (consensusThresholdSubject.value / 100) : 0;

  const countEntries = Object.entries(counts)

  const { consensusItems, dissentItems } = countEntries
    .sort(([, aCount], [, bCount]) => aCount.score - bCount.score)
    .reduce<{ consensusItems: CountItem[], dissentItems: CountItem[] }>((a, [subjectId, count]) => {
    const item: CountItem = {
      subjectId,
      count
    }
    if(count.votes > consensusVotesThreshold) a.consensusItems.push(item)
    else a.dissentItems.push(item)
    return a
  }, { consensusItems: [], dissentItems: [] })

  const { status, reason } = await generateStatusWithReason(subject, [
    () => getEngagementThresholdMetStatusAndReason(allVotes.length, engagementThresholdSubject)
  ])

  return {
    ...subject,
    value: consensusItems.map(item => item.subjectId),
    valueReason: [
      `${consensusItems.length} choices have reached consensus`,
      ...renderItemCounts(consensusItems, allVotes.length),
      `${dissentItems.length} choices didn't make it`,
      ...renderItemCounts(dissentItems, allVotes.length)
    ],
    status: status,
    statusReason: reason
  }
}