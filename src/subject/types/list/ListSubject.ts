import {createSubjectSchema, Subject} from "../../Subject.js";
import z from "zod";

export const ListSubjectValue = z.string().array()
export type ListSubjectValue = z.infer<typeof ListSubjectValue>

export const ListSubjectValueReason = z.string().array()
export type ListSubjectValueReason = z.infer<typeof ListSubjectValueReason>

export const ListSubject = createSubjectSchema(ListSubjectValue, ListSubjectValueReason, 'list').extend({
  types: z.string().array().optional(),
})

export type ListSubject = z.infer<typeof ListSubject>
