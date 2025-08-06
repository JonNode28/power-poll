import {createSubjectSchema, Subject} from "../../Subject.js";
import z from "zod";

export const ListSubject = createSubjectSchema(z.string().array()).extend({
  types: z.string().array().optional(),
})

export type ListSubject = z.infer<typeof ListSubject>