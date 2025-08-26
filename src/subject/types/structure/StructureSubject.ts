import {createSubjectSchema} from "../../Subject.js";
import z from "zod";
import {UnknownSubjectStructure} from "../../SubjectStructure.js";

export const StructureSubjectValueReason = z.string().array()
export type StructureSubjectValueReason = z.infer<typeof StructureSubjectValueReason>

export const StructureSubject = createSubjectSchema(UnknownSubjectStructure, StructureSubjectValueReason, 'structure').extend({
  engagementInput: z.string().optional()
})

export type StructureSubject = z.infer<typeof StructureSubject>
