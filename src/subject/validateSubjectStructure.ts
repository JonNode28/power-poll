import {UnknownSubject} from "./Subject.js";
import {UnknownSubjectStructure} from "./SubjectStructure.js";
import {getSubjectType} from "./types/index.js";

export const validateSubjectStructure = (subject: UnknownSubject, structure: UnknownSubjectStructure): { valid: boolean, reasons?: string[] } => {
  if(subject.type !== structure.type) return { valid: false, reasons: [`Subject type "${subject.type}" doesn't match structure type "${structure.type}"`] }
  const subjectType = getSubjectType(subject.type)
  if(subjectType.validate) return subjectType.validate(subject, structure)
  return { valid: true }
}