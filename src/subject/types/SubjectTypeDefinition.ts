import {z, ZodUnknown} from "zod";
import {Subject, UnknownSubject} from "../Subject.js";
import {ZodType} from "zod";

export interface SubjectVoterProps<S> {
  subject: S,
  userId: string
}

export type VoteFn<S extends Subject<V, VR>, V extends ZodType, VR extends ZodType> = ({ subject, userId }: SubjectVoterProps<S>) => Promise<S> | S
export type UpdateFn<S extends Subject<V, VR>, V extends ZodType, VR extends ZodType> = (subject: S, updatedSubjects: Record<string, UnknownSubject>) => Promise<S> | S

export const InputDefinition = z.object({
  id: z.string(),
  type: z.string(),
  optional: z.boolean().optional()
})

export type InputDefinition = z.infer<typeof InputDefinition>

export interface SubjectTypeDefinition<S extends Subject<V, VR>, V extends ZodType, VR extends ZodType> {
  id: string
  name: string
  description: string
  schema: z.infer<S>
  inputs: InputDefinition[]
  create: (setup: Partial<S>) => S
  vote: VoteFn<S, V, VR>,
  update: UpdateFn<S, V, VR>
}