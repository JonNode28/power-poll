import {createSubjectSchema, Subject} from "../../Subject.js";
import z from "zod";

export const NumberSubject = createSubjectSchema(z.number(), z.string()).extend({
  minInput: z.string().optional(),
  maxInput: z.string().optional(),
})

export type NumberSubject = z.infer<typeof NumberSubject>