import {CreateSubjectStructureFn} from "../SubjectTypeDefinition.js";
import {TextSubjectStructure} from "./TextSubjectStructure.js";
import {confirm, number} from "@inquirer/prompts";
import {TextSubject} from "./TextSubject.js";

export const createStructure: CreateSubjectStructureFn = async () => {
  const textStructure: TextSubjectStructure = {type: 'text'}
  if (await confirm({message: 'Set a minimum text length?'})) {
    const min = await number({message: 'Enter the minimum text length'})
    if (min !== undefined) textStructure.min = min
  }
  if (await confirm({message: 'Set a maximum text length?'})) {
    const max = await number({message: 'Enter the maximum text length'})
    if (max !== undefined) textStructure.max = max
  }
  return textStructure
}