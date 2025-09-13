import {UnknownSubject} from "./Subject.js";
import {UnknownSubjectStructure} from "./SubjectStructure.js";
import {getSubjectType} from "./types/index.js";
import {ValidationResult} from "./types/SubjectTypeDefinition.js";

export const validateSubjectStructure = async (subject: UnknownSubject, structure: UnknownSubjectStructure): Promise<ValidationResult> => {
  if(subject.type !== structure.type) return { valid: false, reasons: [`Subject type "${subject.type}" doesn't match structure type "${structure.type}"`] }
  const subjectType = getSubjectType(subject.type)
  if(subjectType.validate) return await subjectType.validate(subject, structure)
  return { valid: true }
}