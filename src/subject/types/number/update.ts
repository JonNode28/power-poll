import {getUpdatedSubject} from "../../utility/getUpdatedSubject.js";
import {NumberSubject} from "./NumberSubject.js";
import {PercentSubject} from "../percent/PercentSubject.js";
import {UpdateFn} from "../SubjectTypeDefinition.js";
import {isRejected} from "../../Subject.js";
import {ZodType} from "zod";
import {generateStatusWithReason} from "../../status/generateStatusWithReason.js";
import {getEngagementThresholdMetStatusAndReason} from "../../status/getEngagementThresholdMetStatusAndReason.js";
import {getOptionalUpdatedSubject} from "../../utility/getOptionalUpdatedSubject.js";

export const update: UpdateFn<NumberSubject, ZodType<number>, ZodType<string>> = async (
  subject,
  updateId,
  dependencyChain
) => {
  const minValueSubject = (await getOptionalUpdatedSubject(subject.minInput, NumberSubject, updateId, dependencyChain))
  const maxValueSubject = (await getOptionalUpdatedSubject(subject.maxInput, NumberSubject, updateId, dependencyChain))
  const engagementThresholdSubject = (await getOptionalUpdatedSubject(subject.engagementInput, PercentSubject, updateId, dependencyChain))

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