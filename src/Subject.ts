import {z} from "zod";

export const Subject = z.looseObject({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  type: z.string(),
  author: z.string(),
  inputs: z.record(z.string(), z.string()).optional(),
  status: z.enum([ 'rejected', 'pending', 'active' ])
})

export type Subject = z.infer<typeof Subject>