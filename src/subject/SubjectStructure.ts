import z from "zod";

export const UnknownSubjectStructureSchema = z.looseObject({
  type: z.string()
})
export type UnknownSubjectStructure = z.infer<typeof UnknownSubjectStructureSchema>
