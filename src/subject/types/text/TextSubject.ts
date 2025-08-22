import {createSubjectSchema, Subject} from "../../Subject.js";
import z from "zod";

export const TextSubjectVote = z.looseObject({
  timestamp: z.iso.datetime(),
  value: z.string()
})

export type TextSubjectVote = z.infer<typeof TextSubjectVote>

export const TextSubject = createSubjectSchema(z.string(), z.string(), 'text')

export type TextSubject = z.infer<typeof TextSubject>