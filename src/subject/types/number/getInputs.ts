import {GetInputsFn} from "../SubjectTypeDefinition.js";
import {NumberSubject, NumberSubjectValue, NumberSubjectValueReason} from "./NumberSubject.js";

export const getInputs: GetInputsFn<NumberSubject, typeof NumberSubjectValue, typeof NumberSubjectValueReason> = (subject: NumberSubject) => ([
  { name: 'Min', description: 'The minimum value allowed', subjectId: subject.minInput, optional: false },
  { name: 'Max', description: 'The maximum value allowed', subjectId: subject.maxInput, optional: false },
  { name: 'Engagement', description: 'The subject used to determine the engagement threshold', subjectId: subject.engagementInput, optional: false },
])