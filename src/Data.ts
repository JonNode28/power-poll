import {z} from "zod";
import {User} from "./User.js";
import {UnknownSubject} from "./subject/Subject.js";

export const Data = z.object({
  subjects: UnknownSubject.array(),
  users: z.record(z.string(), User)
})

export type Data = z.infer<typeof Data>