import {getUpdatedSubject} from "../../utility/getUpdatedSubject.js";
import {ListSubject, ListSubjectValue, ListSubjectValueReason} from "./ListSubject.js";
import {PercentSubject} from "../percent/PercentSubject.js";
import {UpdateFn} from "../SubjectTypeDefinition.js";
import {isRejected, UnknownSubject} from "../../Subject.js";
import {generateStatusWithReason} from "../../status/generateStatusWithReason.js";
import {getEngagementThresholdMetStatusAndReason} from "../../status/getEngagementThresholdMetStatusAndReason.js";
import {getValidationStatusAndReason} from "../../status/getValidationStatusAndReason.js";
import {StructureSubject} from "../structure/StructureSubject.js";
import {getSubject} from "../../../store.js";
import {getItemStructures} from "./utility/getItemStructures.js";
import {filterValidSubjects} from "./utility/filter.js";
import {getUpdatedSubjects} from "../../utility/getUpdatedSubjects.js";

interface CountItem {
  subjectId: string,
  count: {
    votes: number,
    score: number
  }
}

const renderItemCounts = (items: CountItem[], totalVoteCount: number) => items.map((item, i) => `#${i + 1} ${item.subjectId} (consensus: ${Math.round((item.count.votes / totalVoteCount) * 100)}%, score: ${item.count.score})`)

export const update: UpdateFn<ListSubject, typeof ListSubjectValue, typeof ListSubjectValueReason> = async (
  subject,
  updateId,
  dependencyChain
) => {
  const engagementThresholdSubject = (await getUpdatedSubject(subject.engagementInput, PercentSubject, updateId, dependencyChain))
  const consensusThresholdSubject = (await getUpdatedSubject(subject.consensusInput, PercentSubject, updateId, dependencyChain))

  const structureSubject = await getSubject(subject.structureInput, StructureSubject)
  const itemStructures = await getItemStructures(structureSubject.structure)

  const allVotes = Object.values(subject.votes)
  type CountReduce = Promise<Record<string, { votes: number, score: number}>>

  const counts = await allVotes.reduce<CountReduce>(async (aPromise, c) => {
    const a = await aPromise
    if(isRejected(c)) return a
    // It's important to operate on up-to-date subjects when working out item validity
    const updatedSubjects = await getUpdatedSubjects(c.value, updateId, dependencyChain)
    const validVoteSubjects = await filterValidSubjects(updatedSubjects, itemStructures)

    validVoteSubjects.forEach((subject, i) => {
      const count = a[subject.id]
      if(!count) a[subject.id] = {
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
    () => getValidationStatusAndReason(updatedSubject, updatedSubject.structureInput, updateId, dependencyChain),
  ])

  updatedSubject.status = status
  updatedSubject.statusReason = reason

  return updatedSubject
}