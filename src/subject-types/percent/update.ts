import {PercentSubject} from "./PercentSubject.js";
import {UpdateFn} from "../SubjectTypeDefinition.js";

export const update: UpdateFn<typeof PercentSubject> = async (subject) => {
  const percentSubject = PercentSubject.parse(subject)
  const allVotes = Object.values(percentSubject.votes)
  const newTotal = allVotes.reduce((runningTotal, vote) =>
      runningTotal + vote.value,
    0)

  const newAverageValue = newTotal ? Math.round(newTotal / allVotes.length) : 0
  return {
    ...subject,
    value: newAverageValue,
    status: allVotes.length > 0 ? 'active' : 'pending'
  }
}
