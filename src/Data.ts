import {z} from "zod";
import {Subject} from "./Subject.js";

export const Data = z.object({
  subjects: Subject.array()
})

export type Data = z.infer<typeof Data>