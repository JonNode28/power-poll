import {createSubjectSchema} from "../../Subject.js";
import z from "zod";

export const ListSubjectValue = z.string().array()
export type ListSubjectValue = z.infer<typeof ListSubjectValue>

export const ListSubjectValueReason = z.string().array()
export type ListSubjectValueReason = z.infer<typeof ListSubjectValueReason>

export const ListSubject = createSubjectSchema(ListSubjectValue, ListSubjectValueReason, 'list').extend({
  engagementInput: z.string(),
  consensusInput: z.string(),
  structureInput: z.string().optional(),
})

export type ListSubject = z.infer<typeof ListSubject>
