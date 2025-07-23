import {Subject} from "../../Subject.js";
import z from "zod";

export const TextSubjectVote = z.looseObject({
  timestamp: z.iso.datetime(),
  value: z.string()
})

export type TextSubjectVote = z.infer<typeof TextSubjectVote>

export const TextSubject = Subject.extend({
  value: z.string(),
  votes: z.record(z.string(), TextSubjectVote)
})

export type TextSubject = z.infer<typeof TextSubject>