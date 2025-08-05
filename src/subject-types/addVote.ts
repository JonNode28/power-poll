import {createSubjectSchema, RejectedVote, Subject, ValueVote, Vote} from "../Subject.js";
import z, {ZodType} from "zod";

export const addVote = <V extends ZodType<any>>(
  subject: z.infer<ReturnType<typeof createSubjectSchema<V>>>,
  vote: Vote<V>,
  userId: string
): z.infer<ReturnType<typeof createSubjectSchema<V>>> => {
  return ({
    ...subject,
    votes: {
      ...subject.votes,
      [userId]: vote
    },
    voteArchive: [
      ...subject.voteArchive,
      {
        userId,
        vote
      }
    ]
  })
}

export const addValueVote = <V extends ZodType<any>>(
  subject: Subject<V>,
  value: z.infer<V>,
  userId: string
): Subject<V> => {
  const vote = {
    timestamp: new Date().toISOString(),
    value
  }
  return addVote(subject, vote, userId)
}

export const addRejectionVote = <V extends ZodType<any>>(
  subject: z.infer<ReturnType<typeof createSubjectSchema<V>>>,
  userId: string
): z.infer<ReturnType<typeof createSubjectSchema<V>>> => {
  const vote: RejectedVote = {
    timestamp: new Date().toISOString(),
    rejected: true
  }
  return addVote(subject, vote, userId)
}

