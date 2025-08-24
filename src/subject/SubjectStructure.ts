import z, {ZodObject, ZodType} from "zod";

export const BaseSubjectStructure = z.looseObject({
  type: z.string()
})