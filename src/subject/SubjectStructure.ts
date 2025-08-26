import z from "zod";

export const UnknownSubjectStructure = z.looseObject({
  type: z.string()
})
export type UnknownSubjectStructure = z.infer<typeof UnknownSubjectStructure>
