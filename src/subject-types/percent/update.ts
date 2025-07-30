import {PercentSubject} from "./PercentSubject.js";
import {UpdateFn} from "../SubjectTypeDefinition.js";
import {generateStatusWithReason} from "../../generateStatusWithReason.js";

export const update: UpdateFn<typeof PercentSubject> = async (subject) => {
  const percentSubject = PercentSubject.parse(subject)
  const allVotes = Object.values(percentSubject.votes)
  const newTotal = allVotes.reduce((runningTotal, vote) =>
      runningTotal + vote.value,
    0)

  const newAverageValue = newTotal ? Math.round(newTotal / allVotes.length) : 0

  const someVotesReceived = allVotes.length > 0

  const { status, reason } = await generateStatusWithReason([
    () => ({ status: someVotesReceived ? 'active' : 'pending', reason: `${someVotesReceived ? 'some' : 'no'} votes received (${allVotes.length})` })
  ])

  return {
    ...subject,
    value: newAverageValue,
    status: status,
    statusReason: reason
  }
}
