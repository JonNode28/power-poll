import z from "zod";
import {UnknownSubjectStructureSchema} from "../../SubjectStructure.js";

export const MapSubjectStructure = UnknownSubjectStructureSchema.extend({
  properties: z.record(z.string(), UnknownSubjectStructureSchema).optional()
})
export type MapSubjectStructure = z.infer<typeof MapSubjectStructure>