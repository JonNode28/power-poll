import {z} from "zod";
import {Subject} from "../Subject.js";

export interface SubjectVoterProps<S> {
  subject: S,
  userId: string
}

export type VoteFn<S extends Subject> = ({ subject, userId }: SubjectVoterProps<S>) => Promise<S> | S
export type UpdateFn<S extends Subject> = (subject: S, updatedSubjects: Record<string, Subject>) => Promise<S> | S

export const InputDefinition = z.object({
  id: z.string(),
  type: z.string(),
  optional: z.boolean().optional()
})

export type InputDefinition = z.infer<typeof InputDefinition>

export interface SubjectTypeDefinition<S extends Subject> {
  id: string
  name: string
  description: string
  schema: z.infer<S>
  inputs: InputDefinition[]
  generate: (setup: Partial<S>) => S
  vote: VoteFn<S>,
  update: UpdateFn<S>
}