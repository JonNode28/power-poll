import {createSubjectSchema, Subject} from "../../Subject.js";
import z from "zod";

export const PercentSubject = createSubjectSchema(z.number(), z.string(), 'percent')

export type PercentSubject = z.infer<typeof PercentSubject>