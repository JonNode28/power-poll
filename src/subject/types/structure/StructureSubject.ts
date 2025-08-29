import {createSubjectSchema} from "../../Subject.js";
import z from "zod";
import {UnknownSubjectStructure} from "../../SubjectStructure.js";

export const StructureSubjectValue = z.literal(true)
export type StructureSubjectValue = z.infer<typeof StructureSubjectValue>


export const StructureSubjectValueReason = z.string().array()
export type StructureSubjectValueReason = z.infer<typeof StructureSubjectValueReason>

export const StructureSubject = createSubjectSchema(StructureSubjectValue, StructureSubjectValueReason, 'structure').extend({
  engagementInput: z.string().optional(),
  structure: UnknownSubjectStructure
})

export type StructureSubject = z.infer<typeof StructureSubject>
