import {Subject} from "../../Subject.js";
import z from "zod";

export const NumberSubject = Subject.extend({
  minInput: z.string().optional(),
  maxInput: z.string().optional(),
  value: z.number(),
  votes: z.record(z.string(), z.looseObject({
    timestamp: z.iso.datetime(),
    value: z.number()
  }))
})

export type NumberSubject = z.infer<typeof NumberSubject>