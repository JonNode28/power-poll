import {z} from "zod";
import {Subject} from "./Subject.js";
import {User} from "./User.js";

export const Data = z.object({
  subjects: Subject.array(),
  users: z.record(z.string(), User)
})

export type Data = z.infer<typeof Data>