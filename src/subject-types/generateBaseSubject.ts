import {Subject} from "../Subject.js";

export interface GenerateBaseSubjectProps<S extends Subject> {
  setup: Partial<S>,

}

export const generateBaseSubject = <S extends Subject>({ setup }: GenerateBaseSubjectProps<S>) => ({
  id: 'unnamed-subject',
  name: 'Un-named Subject',
  description: '',
  author: 'system',
  inputs: {},
  status: 'pending',
  statusReason: [{ status: 'pending', reason: 'Newly created' }],
  value: undefined,
  rejected: false,
  valueArchive: [],
  votes: {},
  voteArchive: [],
  ...setup,
  type: 'number'
})