import {z} from "zod";
import {Data} from "../Data.js";
import {Subject} from "../Subject.js";

export const BaseSubjectType = z.object({
  name: z.string(),
  inputs: z.array(z.object({
    id: z.string(),
    type: z.string()
  })).optional()
})

export type SubjectDefinition = z.infer<typeof BaseSubjectType>