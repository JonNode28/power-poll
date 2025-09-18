import z from "zod";
import {UnknownSubjectStructureSchema} from "../../SubjectStructure.js";

export const ListSubjectStructure = UnknownSubjectStructureSchema.extend({
  min: z.number().optional(),
  max: z.number().optional(),
  // Constraints that apply to items at any position
  items: z.string().array().optional(),
})
export type ListSubjectStructure = z.infer<typeof ListSubjectStructure>