import {z} from "zod";
import {User} from "./User.js";
import {UnknownSubject} from "./subject/Subject.js";
import {UnknownSubjectStructure} from "./subject/SubjectStructure.js";

export const Data = z.object({
  subjects: UnknownSubject.array(),
  voteConstraints: UnknownSubjectStructure.array(),
  users: z.record(z.string(), User)
})

export type Data = z.infer<typeof Data>