import {z} from "zod";
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

export interface CreateSubjectFn<S extends Subject<V, VR>, V extends ZodType, VR extends ZodType> {
  (setup: Partial<S>): Promise<S | undefined>
}

export interface CreateSubjectStructureFn {
  (): UnknownSubjectStructure | Promise<UnknownSubjectStructure>
}

export interface GetInputsFn<S extends Subject<V, VR>, V extends ZodType, VR extends ZodType> {
  (subject: S): Input[]
}

export interface ValidationResult { valid: boolean, reasons?: string[] }

export interface ValidateFn<S extends Subject<V, VR>, V extends ZodType, VR extends ZodType> {
  (subject: S, structure: UnknownSubjectStructure): ValidationResult | Promise<ValidationResult>
}

export interface SubjectTypeDefinition<S extends Subject<V, VR>, V extends ZodType, VR extends ZodType> {
  id: string
  name: string
  description: string
  subjectSchema: z.infer<S>
  getInputs?: GetInputsFn<S, V, VR>
  createSubject: CreateSubjectFn<S, V, VR>
  createStructure?: CreateSubjectStructureFn
  /**
   * This function determines if a subject is valid. It's up to the subject type to decide what this means.
   *
   * For example a list subject may decide that invalid items are excluded but don't make the list invalid.
   * It may also determine that a number of valid items lower than the defined `min` threshold does make the list invalid
   *
   * Invalid subjects will have a status of 'Pending' while we wait for them to become valid
   */
  validate?: ValidateFn<S, V, VR>
  vote: VoteFn<S, V, VR>
  update: UpdateFn<S, V, VR>
}