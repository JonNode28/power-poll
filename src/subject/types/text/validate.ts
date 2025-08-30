import {ValidateFn} from "../SubjectTypeDefinition.js";
import {TextSubject, TextSubjectValue, TextSubjectValueReason} from "./TextSubject.js";
import {TextSubjectStructure} from "./TextSubjectStructure.js";

export const validate: ValidateFn<TextSubject, typeof TextSubjectValue, typeof TextSubjectValueReason> = (subject: TextSubject, structure: TextSubjectStructure) => {
  if(!subject.value) return { valid: false, reasons: [`Subject has no value`] }
  if(structure.min && subject.value.length < structure.min) return { valid: false, reasons: [`Value of length ${subject.value.length} is lower than minimum threshold ${structure.min}`] }
  if(structure.max && subject.value.length > structure.max) return { valid: false, reasons: [`Value of length ${subject.value.length} is higher than maximum threshold ${structure.max}`] }
  return { valid: true }
}