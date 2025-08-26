import z from "zod";
import {UnknownSubjectStructure} from "../../SubjectStructure.js";

export const ListSubjectStructure = UnknownSubjectStructure.extend({
  min: z.number().optional(),
  max: z.number().optional(),
  // Constraints that apply to items at any position
  items: UnknownSubjectStructure.array().optional(),
})
export type ListSubjectStructure = z.infer<typeof ListSubjectStructure>