import {createSubjectSchema, RejectedVote, Subject, ValueVote, Vote} from "../Subject.js";
import z, {ZodType} from "zod";

export const addVote = <S extends Subject<V, VR>, V extends ZodType, VR extends ZodType>(
  subject: S,
  vote: Vote<V>,
  userId: string
): S => {
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

export const addValueVote = <S extends Subject<V, VR>, V extends ZodType, VR extends ZodType>(
  subject: S,
  value: z.infer<V>,
  userId: string
): S => {
  const vote = {
    timestamp: new Date().toISOString(),
    value
  }
  return addVote<S, V, VR>(subject, vote, userId)
}

export const addRejectionVote = <S extends Subject<V, VR>, V extends ZodType, VR extends ZodType>(
  subject: S,
  userId: string
): S => {
  const vote: RejectedVote = {
    timestamp: new Date().toISOString(),
    rejected: true
  }
  return addVote<S, V, VR>(subject, vote, userId)
}

