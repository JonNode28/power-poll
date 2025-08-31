import {GetInputsFn} from "../SubjectTypeDefinition.js";
import {MapSubject, MapSubjectValue, MapSubjectValueReason} from "./MapSubject.js";

export const getInputs: GetInputsFn<MapSubject, typeof MapSubjectValue, typeof MapSubjectValueReason> = (subject: MapSubject) => ([
  {
    name: 'Engagement',
    description: 'The subject used to determine the engagement threshold',
    subjectId: subject.engagementInput,
    optional: false
  },
  {
    name: 'Consensus',
    description: 'The subject used to determine the consensus threshold',
    subjectId: subject.consensusInput,
    optional: false
  },
  {
    name: 'Structure',
    description: 'The subject used to determine the structure threshold',
    subjectId: subject.structureInput,
    optional: true
  },
])