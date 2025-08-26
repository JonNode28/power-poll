import {z, ZodUnknown} from "zod";
import {Subject, UnknownSubject} from "../Subject.js";
import {ZodType} from "zod";
import {UnknownSubjectStructure} from "../SubjectStructure.js";

export interface SubjectVoterProps<S> {
  subject: S,
  userId: string
}

export type VoteFn<S extends Subject<V, VR>, V extends ZodType, VR extends ZodType> = ({ subject, userId }: SubjectVoterProps<S>) => Promise<S> | S
export type UpdateFn<S extends Subject<V, VR>, V extends ZodType, VR extends ZodType> = (subject: S, updatedSubjects: Record<string, UnknownSubject>) => Promise<S> | S

export const Input = z.object({
  name: z.string(),
  subjectId: z.string().optional(),
  description: z.string().optional(),
  optional: z.boolean().optional()
})

export type Input = z.infer<typeof Input>

export interface SubjectTypeDefinition<
  S extends Subject<V, VR>,
  V extends ZodType,
  VR extends ZodType
> {
  id: string
  name: string
  description: string
  subjectSchema: z.infer<S>
  getInputs?: (subject: S) => Input[]
  createSubject: (setup: Partial<S>) => Promise<S | undefined>
  createStructure?: () => UnknownSubjectStructure | Promise<UnknownSubjectStructure>
  vote: VoteFn<S, V, VR>
  update: UpdateFn<S, V, VR>
}