import {getSubject, getSubjects} from "../../../../store.js";
import {UnknownSubject} from "../../../Subject.js";
import {validateSubjectStructure} from "../../../validateSubjectStructure.js";
import {UnknownSubjectStructure, UnknownSubjectStructureSchema} from "../../../SubjectStructure.js";
import {ListSubjectStructure} from "../ListSubjectStructure.js";
import {getStructure} from "../../structure/utility/getStructure.js";

export const filterValidSubjectIds = async (itemSubjectIds: string[], itemStructureSubjects?: UnknownSubjectStructure[]) => {
  const subjects = await getSubjects(itemSubjectIds)
  return (await filterValidSubjects(subjects, itemStructureSubjects))
    .map(subject => subject.id)
}

export const filterValidSubjectIdsByStructureId = async (itemSubjectIds: string[], listSubjectStructureId?: string) => {
  const listStructureSubject = listSubjectStructureId
    ? await getSubject(listSubjectStructureId, ListSubjectStructure)
    : null
  if(!listStructureSubject?.items) return filterValidSubjectIds(itemSubjectIds)
  return await filterValidSubjectIds(itemSubjectIds, await getSubjects(listStructureSubject.items))
}

export const filterValidSubjects = async (itemSubjects: UnknownSubject[], itemStructureSubjects?: UnknownSubjectStructure[]) => {
  if(!itemStructureSubjects) return itemSubjects

  const validationResult = await Promise.all(itemSubjects.map(async (itemSubject) => {
    for (const itemStructureSubject of itemStructureSubjects) {
      const validationResult = await validateSubjectStructure(itemSubject, itemStructureSubject)
      if(validationResult.valid) return { valid: true, itemSubject }
    }
    return { valid: false, itemSubject }
  }))
  return validationResult
    .filter(result => result.valid)
    .map(result => result.itemSubject)
}

export const filterValidSubjectsByStructureId = async (itemSubjects: UnknownSubject[], listSubjectStructureId?: string) => {
  const listStructure = listSubjectStructureId
    ? await getStructure(listSubjectStructureId, ListSubjectStructure)
    : undefined
  if(!listStructure?.items?.length) return filterValidSubjects(itemSubjects)
  const itemStructures = await Promise.all(listStructure.items.map(itemStructureSubjectId => getStructure(itemStructureSubjectId, UnknownSubjectStructureSchema)))
  return filterValidSubjects(itemSubjects, itemStructures)
}

