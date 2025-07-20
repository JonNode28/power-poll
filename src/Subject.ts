import {z} from "zod";

export const Subject = z.looseObject({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  type: z.string(),
  author: z.string(),
  inputs: z.array(z.object({
    id: z.string(),
    subjectId: z.string()
  })).optional()
})

export type Subject = z.infer<typeof Subject>