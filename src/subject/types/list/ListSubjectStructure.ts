import z from "zod";
import {BaseSubjectStructure} from "../../SubjectStructure.js";

export const ListSubjectStructure = BaseSubjectStructure.extend({
  min: z.number().optional(),
  max: z.number().optional(),
  // Constraints that apply to items at any position
  items: BaseSubjectStructure.array().optional(),
  // Constraints that apply at specific indexes in the list
  positions: BaseSubjectStructure.array().array().optional()
})
export type ListSubjectStructure = z.infer<typeof ListSubjectStructure>