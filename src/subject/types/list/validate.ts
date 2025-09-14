import {ValidateFn} from "../SubjectTypeDefinition.js";
import {ListSubject, ListSubjectValue, ListSubjectValueReason} from "./ListSubject.js";
import {ListSubjectStructure} from "./ListSubjectStructure.js";
import {getItemStructures} from "./utility/getItemStructures.js";
import {filterValidSubjectIds} from "./utility/filter.js";

export const validate: ValidateFn<ListSubject, typeof ListSubjectValue, typeof ListSubjectValueReason> = async (subject: ListSubject, structure: ListSubjectStructure) => {
  if (!subject.value) return { valid: false, reasons: [`Subject has no value`] }

  const validItems = await filterValidSubjectIds(subject.value, await getItemStructures(structure))

  if (structure.min && validItems.length < structure.min) return {
    valid: false,
    reasons: [`Value of length ${validItems.length} is lower than minimum threshold ${structure.min}`]
  }
  if (structure.max && validItems.length > structure.max) return {
    valid: false,
    reasons: [`Value of length ${validItems.length} is higher than maximum threshold ${structure.max}`]
  }
  return {valid: true}
}