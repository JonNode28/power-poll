import {UnknownSubjectStructure} from "../../SubjectStructure.js";
import z from "zod";

export const TextSubjectStructure = UnknownSubjectStructure.extend({
  min: z.number().optional(),
  max: z.number().optional(),
})
export type TextSubjectStructure = z.infer<typeof TextSubjectStructure>