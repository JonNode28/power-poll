import {UnknownSubject} from "../Subject.js";
import {StructureSubject} from "./structure/StructureSubject.js";
import {getSubjects} from "../../store.js";

export const getStructureSubjects = async (type: string, allSubjects?: UnknownSubject[]): Promise<StructureSubject[]> => {
  if(!allSubjects) allSubjects = await getSubjects()
  return allSubjects
    .filter((subject): subject is StructureSubject  =>
      subject.type === 'structure')
    .filter(structureSubject => structureSubject.structure?.type === 'text')
}