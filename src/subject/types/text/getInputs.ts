import {GetInputsFn} from "../SubjectTypeDefinition.js";
import {TextSubject, TextSubjectValue, TextSubjectValueReason} from "./TextSubject.js";

export const getInputs: GetInputsFn<TextSubject, typeof TextSubjectValue, typeof TextSubjectValueReason> = (subject: TextSubject) => ([
  { name: 'Engagement', description: 'The subject used to determine the engagement threshold', subjectId: subject.engagementInput, optional: false },
  { name: 'Consensus', description: 'The subject used to determine the consensus threshold', subjectId: subject.consensusInput, optional: false }
])