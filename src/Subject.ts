import {z, ZodType} from "zod";
import {CriteriaResult} from "./generateStatusWithReason.js";
import {SubjectStatus} from "./SubjectStatus.js";

export const createValueVoteSchema = <V extends ZodType<any>>(valueSchema: V) => {
 return z.object({
    timestamp: z.iso.datetime(),
    value: valueSchema
  })
}

export type ValueVote<V extends ZodType<any>> = z.infer<ReturnType<typeof createValueVoteSchema<V>>>

const RejectedVote = z.object({
  timestamp: z.iso.datetime(),
  rejected: z.literal(true)
})

export type RejectedVote = z.infer<typeof RejectedVote>

export const createVoteSchema = <V extends ZodType<any>>(valueSchema: V) => {
  return z.union([ createValueVoteSchema(valueSchema), RejectedVote ])
}

export type Vote<V extends ZodType<any>> = z.infer<ReturnType<typeof createVoteSchema<V>>>

export const createSubjectSchema = <V extends ZodType<any>>(valueSchema: V) => {
  return z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    type: z.string(),
    author: z.string(),
    inputs: z.record(z.string(), z.string()).optional(),
    status: SubjectStatus,
    statusReason: CriteriaResult.array(),
    valueUpdatedTimestamp: z.iso.datetime().optional(),
    value: valueSchema.optional(),
    rejected: z.boolean(),
    valueArchive: z.array(
      z.object({
        timestamp: z.iso.datetime(),
        value: valueSchema,
        rejected: z.boolean()
      }),
    ),
    votes: z.record(z.string(), createVoteSchema(valueSchema)),
    voteArchive: z.array(z.object({
      userId: z.string(),
      vote: createVoteSchema(valueSchema)
    }))
  })
}

export const UnknownSubject = createSubjectSchema(z.unknown())

export type SubjectSchema<V extends ZodType<any>> = ReturnType<typeof createSubjectSchema<V>>

export type Subject<V extends ZodType<any> = ZodType<unknown>> = z.infer<SubjectSchema<V>>

export function isRejected<V extends ZodType<any>>(vote: ValueVote<V> | RejectedVote): vote is RejectedVote {
  return 'rejected' in vote;
}