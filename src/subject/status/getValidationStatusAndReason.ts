import {UnknownSubject} from "../Subject.js";
import {validateSubjectStructure} from "../validateSubjectStructure.js";
import {getSubjects} from "../../store.js";
import {StructureSubject} from "../types/structure/StructureSubject.js";
import {StatusCriteriaResult} from "./generateStatusWithReason.js";

export const getValidationStatusAndReason = async (subject: UnknownSubject, structureSubjectId: string | undefined): Promise<StatusCriteriaResult> => {
  if(!structureSubjectId) return {
    status: 'active',
    reason: 'No structure to meet'
  }
  const foundStructureSubject = (await getSubjects()).find(subject => subject.id === structureSubjectId)
  const structureSubject = StructureSubject.parse(foundStructureSubject)
  if(!structureSubject.value) throw new Error(`Structure subject "${structureSubjectId}" doesn't have a value to check`)

  const validationResult = validateSubjectStructure(subject, structureSubject.structure)
  const joinedReasons = validationResult.reasons?.join('. ')
  if(validationResult.valid) return {
    status: 'active',
    reason: joinedReasons ?? 'Text meets required structure'
  }
  return {
    status: 'pending',
    reason: joinedReasons ?? 'Unknown'
  }
}