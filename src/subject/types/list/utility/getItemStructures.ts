import {getSubject} from "../../../../store.js";
import {StructureSubject} from "../../structure/StructureSubject.js";
import {ListSubjectStructure} from "../ListSubjectStructure.js";

export const getItemStructures = async (listStructure: ListSubjectStructure) => {
  return listStructure.items
    ? await Promise.all(listStructure.items.map(async (itemStructureSubjectId) =>
      (await getSubject(itemStructureSubjectId, StructureSubject)).structure))
    : undefined
}