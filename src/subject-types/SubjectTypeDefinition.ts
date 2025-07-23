import {z, ZodObject} from "zod";
import {Subject} from "../Subject.js";

export interface SubjectVoterProps {
  subject: Subject,
  userId: string
}

export type VoteFn = ({ subject, userId }: SubjectVoterProps) => Promise<Subject> | Subject

export const InputDefinition = z.object({
  id: z.string(),
  type: z.string(),
  optional: z.boolean().optional()
})

export type InputDefinition = z.infer<typeof InputDefinition>

export interface SubjectTypeDefinition<S extends typeof Subject> {
  id: string
  name: string
  description: string
  schema: S
  inputs: InputDefinition[]
  generate: () => object
  vote: VoteFn,
  update: (subject: z.infer<S>, updatedSubjects: Record<string, Subject>) => Promise<z.infer<S>> | z.infer<S>
}