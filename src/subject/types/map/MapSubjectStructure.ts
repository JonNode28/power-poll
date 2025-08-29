import z from "zod";
import {UnknownSubjectStructure} from "../../SubjectStructure.js";

export const MapSubjectStructure = UnknownSubjectStructure.extend({
  properties: z.record(z.string(), UnknownSubjectStructure).optional()
})
export type MapSubjectStructure = z.infer<typeof MapSubjectStructure>