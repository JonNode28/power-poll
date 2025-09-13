import {getSubject, getSubjects} from "../../../../store.js";
import {UnknownSubject} from "../../../Subject.js";
import {validateSubjectStructure} from "../../../validateSubjectStructure.js";
import {UnknownSubjectStructure} from "../../../SubjectStructure.js";
import {ListSubjectStructure} from "../ListSubjectStructure.js";

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
  const listStructureSubject = listSubjectStructureId
    ? await getSubject(listSubjectStructureId, ListSubjectStructure)
    : undefined
  if(!listStructureSubject?.items) return filterValidSubjects(itemSubjects)
  return filterValidSubjects(itemSubjects, await getSubjects(listStructureSubject.items))
}

