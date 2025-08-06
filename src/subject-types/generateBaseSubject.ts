import {Subject} from "../Subject.js";

export interface GenerateBaseSubjectProps<S extends Subject> {
  type: string,
  setup: Partial<S>,
}

export const generateBaseSubject = <S extends Subject>({ type, setup }: GenerateBaseSubjectProps<S>) => ({
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