import {Subject} from "../../Subject.js";
import z from "zod";

export const PercentSubject = Subject.extend({
  value: z.number(),
  votes: z.record(z.string(), z.looseObject({
    timestamp: z.iso.datetime(),
    value: z.number()
  }))
})