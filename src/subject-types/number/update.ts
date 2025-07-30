import {getUpdatedInputSubject} from "../../getUpdatedInputSubject.js";
import {NumberSubject} from "./NumberSubject.js";
import {PercentSubject} from "../percent/PercentSubject.js";
import {getUsers} from "../../store.js";
import {UpdateFn} from "../SubjectTypeDefinition.js";
import {getEngagementThresholdMetStatusAndReason} from "../../getEngagementThresholdMetStatusAndReason.js";
import {generateStatusWithReason} from "../../generateStatusWithReason.js";

export const update: UpdateFn<typeof NumberSubject> = async (subject, updatedSubjects) => {
  const minValueSubject = (await getUpdatedInputSubject(subject.inputs?.min, NumberSubject, updatedSubjects))
  const maxValueSubject = (await getUpdatedInputSubject(subject.inputs?.max, NumberSubject, updatedSubjects))
  const engagementThresholdSubject = (await getUpdatedInputSubject(subject.inputs?.engagement, PercentSubject, updatedSubjects))

  const allVotes = Object.values(subject.votes)
  const newTotal = allVotes.reduce((runningTotal, vote) => {
    if(withinRange(vote.value, minValueSubject, maxValueSubject)) runningTotal += vote.value
    return runningTotal
  },0)

  const newAverageValue = newTotal ? Math.round(newTotal / allVotes.length) : 0

  const { status, reason } = await generateStatusWithReason([
    () => getEngagementThresholdMetStatusAndReason(allVotes.length, engagementThresholdSubject)
  ])

  return {
    ...subject,
    value: newAverageValue,
    status: status,
    statusReason: reason
  }
}

function withinRange(value: number, minSubject: NumberSubject | undefined, maxSubject: NumberSubject | undefined){
  return (typeof minSubject === 'undefined' || value >= minSubject.value) &&
    (typeof maxSubject === 'undefined' || value >= maxSubject.value)
}