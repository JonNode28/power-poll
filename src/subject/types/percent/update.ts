import {PercentSubject} from "./PercentSubject.js";
import {UpdateFn} from "../SubjectTypeDefinition.js";
import {isRejected} from "../../Subject.js";
import {ZodType} from "zod";
import {generateStatusWithReason} from "../../status/generateStatusWithReason.js";

export const update: UpdateFn<PercentSubject, ZodType<number>, ZodType<string>> = async (subject) => {
  const percentSubject = PercentSubject.parse(subject)
  const allVotes = Object.values(percentSubject.votes)
  const newTotal = allVotes
    .reduce((runningTotal, vote) =>
      isRejected(vote) ? runningTotal : runningTotal + vote.value,
    0)

  const newAverageValue = newTotal ? Math.round(newTotal / allVotes.length) : 0

  const someVotesReceived = allVotes.length > 0

  const { status, reason } = await generateStatusWithReason(subject, [
    () => ({ status: someVotesReceived ? 'active' : 'pending', reason: `${someVotesReceived ? 'some' : 'no'} votes received (${allVotes.length})` })
  ])

  return {
    ...subject,
    value: newAverageValue,
    valueReason: `new total (${newTotal}) / number of votes (${allVotes}) rounded`,
    status: status,
    statusReason: reason
  }
}
