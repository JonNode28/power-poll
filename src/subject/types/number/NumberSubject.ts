import {createSubjectSchema, Subject} from "../../Subject.js";
import z from "zod";

export const NumberSubjectValue = z.number()
export type NumberSubjectValue = z.infer<typeof NumberSubjectValue>

export const NumberSubjectValueReason = z.string()
export type NumberSubjectValueReason = z.infer<typeof NumberSubjectValueReason>

export const NumberSubject = createSubjectSchema(NumberSubjectValue, NumberSubjectValueReason, 'number').extend({
  minInput: z.string().optional(),
  maxInput: z.string().optional(),
  engagementInput: z.string().optional()
})

export type NumberSubject = z.infer<typeof NumberSubject>