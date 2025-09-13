import {getUpdatedInputSubject} from "../../getUpdatedInputSubject.js";
import {ListSubject, ListSubjectValue, ListSubjectValueReason} from "./ListSubject.js";
import {PercentSubject} from "../percent/PercentSubject.js";
import {UpdateFn} from "../SubjectTypeDefinition.js";
import {isRejected} from "../../Subject.js";
import {generateStatusWithReason} from "../../status/generateStatusWithReason.js";
import {getEngagementThresholdMetStatusAndReason} from "../../status/getEngagementThresholdMetStatusAndReason.js";
import {getValidationStatusAndReason} from "../../status/getValidationStatusAndReason.js";
import {StructureSubject} from "../structure/StructureSubject.js";
import {getSubject} from "../../../store.js";
import {getItemStructures} from "./utility/getItemStructures.js";
import {filterValidSubjectIds} from "./utility/filter.js";

interface CountItem {
  subjectId: string,
  count: {
    votes: number,
    score: number
  }
}

const renderItemCounts = (items: CountItem[], totalVoteCount: number) => items.map((item, i) => `#${i + 1} ${item.subjectId} (consensus: ${Math.round((item.count.votes / totalVoteCount) * 100)}%, score: ${item.count.score})`)

export const update: UpdateFn<ListSubject, typeof ListSubjectValue, typeof ListSubjectValueReason> = async (subject, updatedSubjects) => {
  const engagementThresholdSubject = (await getUpdatedInputSubject(subject.engagementInput, PercentSubject, updatedSubjects))
  const consensusThresholdSubject = (await getUpdatedInputSubject(subject.consensusInput, PercentSubject, updatedSubjects))

  const structureSubject = await getSubject(subject.structureInput, StructureSubject)
  const itemStructures = await getItemStructures(structureSubject.structure)

  const allVotes = Object.values(subject.votes)
  type CountReduce = Promise<Record<string, { votes: number, score: number}>>
  const counts = await allVotes.reduce<CountReduce>(async (aPromise, c) => {
    const a = await aPromise
    if(isRejected(c)) return a

    const validVotes = await filterValidSubjectIds(c.value, itemStructures)

    validVotes.forEach((subjectId, i) => {
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
  }, Promise.resolve({}))

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

  const updatedSubject = {
    ...subject,
    value: consensusItems.map(item => item.subjectId),
    valueReason: [
      `${consensusItems.length} choices have reached consensus`,
      ...renderItemCounts(consensusItems, allVotes.length),
      `${dissentItems.length} choices didn't make it`,
      ...renderItemCounts(dissentItems, allVotes.length)
    ],
  }

  const { status, reason } = await generateStatusWithReason(subject, [
    () => getEngagementThresholdMetStatusAndReason(allVotes.length, engagementThresholdSubject),
    () => getValidationStatusAndReason(updatedSubject, updatedSubject.structureInput),
  ])

  updatedSubject.status = status
  updatedSubject.statusReason = reason

  return updatedSubject
}