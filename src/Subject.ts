import {z} from "zod";
import {CriteriaResult} from "./generateStatusWithReason.js";
import {SubjectStatus} from "./SubjectStatus.js";

export const Subject = z.looseObject({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  type: z.string(),
  author: z.string(),
  inputs: z.record(z.string(), z.string()).optional(),
  status: SubjectStatus,
  statusReason: CriteriaResult.array()
})

export type Subject = z.infer<typeof Subject>