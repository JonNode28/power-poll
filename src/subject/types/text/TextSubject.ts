import {createSubjectSchema, Subject} from "../../Subject.js";
import z from "zod";

export const TextSubjectValue = z.string()
export type TextSubjectValue = z.infer<typeof TextSubjectValue>

export const TextSubjectValueReason = z.string()
export type TextSubjectValueReason = z.infer<typeof TextSubjectValueReason>

export const TextSubject = createSubjectSchema(TextSubjectValue, TextSubjectValueReason, 'text').extend({
  engagementInput: z.string(),
  consensusInput: z.string(),
  structureInput: z.string().optional(),
})

export type TextSubject = z.infer<typeof TextSubject>