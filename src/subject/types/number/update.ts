import {getUpdatedSubject} from "../../getUpdatedSubject.js";
import {NumberSubject} from "./NumberSubject.js";
import {PercentSubject} from "../percent/PercentSubject.js";
import {UpdateFn} from "../SubjectTypeDefinition.js";
import {isRejected} from "../../Subject.js";
import {ZodType} from "zod";
import {generateStatusWithReason} from "../../status/generateStatusWithReason.js";
import {getEngagementThresholdMetStatusAndReason} from "../../status/getEngagementThresholdMetStatusAndReason.js";

export const update: UpdateFn<NumberSubject, ZodType<number>, ZodType<string>> = async (subject, updatedSubjects) => {
  const minValueSubject = (await getUpdatedSubject(subject.minInput, NumberSubject, updatedSubjects))
  const maxValueSubject = (await getUpdatedSubject(subject.maxInput, NumberSubject, updatedSubjects))
  const engagementThresholdSubject = (await getUpdatedSubject(subject.engagementInput, PercentSubject, updatedSubjects))

  const allVotes = Object.values(subject.votes)
  const newTotal = allVotes.reduce((runningTotal, vote) => {
    if(!isRejected(vote) && withinRange(vote.value, minValueSubject, maxValueSubject)) runningTotal += vote.value
    return runningTotal
  },0)

  const newAverageValue = newTotal ? Math.round(newTotal / allVotes.length) : 0

  const { status, reason } = await generateStatusWithReason(subject, [
    () => getEngagementThresholdMetStatusAndReason(allVotes.length, engagementThresholdSubject)
  ])

  return {
    ...subject,
    value: newAverageValue,
    valueReason: `new total (${newTotal}) / number of votes (${allVotes}) rounded`,
    status: status,
    statusReason: reason
  }
}

function withinRange(value: number, minSubject: NumberSubject | undefined, maxSubject: NumberSubject | undefined){
  return (typeof minSubject?.value === 'undefined' || value >= minSubject.value) &&
    (typeof maxSubject?.value === 'undefined' || value >= maxSubject.value)
}