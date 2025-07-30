import {z} from "zod";

export const SubjectStatus = z.enum([ 'rejected', 'pending', 'active' ])
export type SubjectStatus = z.infer<typeof SubjectStatus>