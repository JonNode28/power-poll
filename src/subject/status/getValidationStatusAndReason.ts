import {UnknownSubject} from "../Subject.js";
import {validateSubjectStructure} from "../validateSubjectStructure.js";
import {getSubjects} from "../../store.js";
import {StructureSubject} from "../types/structure/StructureSubject.js";
import {StatusCriteriaResult} from "./generateStatusWithReason.js";
import {getUpdatedSubject} from "../utility/getUpdatedSubject.js";

export const getValidationStatusAndReason = async (
  subject: UnknownSubject,
  structureSubjectId: string | undefined,
  updateId: string,
  dependencyChain: string[]
): Promise<StatusCriteriaResult> => {
  if (!structureSubjectId) return {
    status: 'active',
    reason: 'No structure to meet'
  }
  const structureSubject = await getUpdatedSubject(structureSubjectId, StructureSubject, updateId, dependencyChain)
  if (!structureSubject.value) return {
    status: 'pending',
    reason: `Structure subject ${structureSubjectId} doesn't have a value yet`,
  }

  const validationResult = await validateSubjectStructure(subject, structureSubject.structure)
  const joinedReasons = validationResult.reasons?.join('. ')
  if (validationResult.valid) return {
    status: 'active',
    reason: joinedReasons ?? 'Text meets required structure'
  }
  return {
    status: 'pending',
    reason: joinedReasons ?? 'Unknown'
  }
}