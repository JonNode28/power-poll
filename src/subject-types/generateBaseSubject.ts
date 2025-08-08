import {Subject} from "../Subject.js";
import {ZodType} from "zod";

export interface GenerateBaseSubjectProps<S extends Subject<V, VR>, V extends ZodType, VR extends ZodType> {
  type: string,
  setup: Partial<S>,
}

export const generateBaseSubject = <S extends Subject<V, VR>, V extends ZodType, VR extends ZodType>({ type, setup }: GenerateBaseSubjectProps<S, V, VR>) => ({
  id: 'unnamed-subject',
  name: 'Un-named Subject',
  description: '',
  author: 'system',
  inputs: {},
  status: 'pending',
  statusReason: [{ status: 'pending', reason: 'Newly created' }],
  value: undefined,
  valueReason: 'Newly created',
  rejected: false,
  valueArchive: [],
  votes: {},
  voteArchive: [],
  ...setup,
  type
})