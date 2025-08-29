import {createSubjectSchema} from "../../Subject.js";
import z from "zod";

export const MapSubjectValue = z.record(z.string(), z.string())
export type MapSubjectValue = z.infer<typeof MapSubjectValue>

export const MapSubjectValueReason = z.string().array()
export type MapSubjectValueReason = z.infer<typeof MapSubjectValueReason>

export const MapSubject = createSubjectSchema(MapSubjectValue, MapSubjectValueReason, 'map').extend({
  engagementInput: z.string(),
  consensusInput: z.string(),
  structureInput: z.string().optional(),
})

export type MapSubject = z.infer<typeof MapSubject>
