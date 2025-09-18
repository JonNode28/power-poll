import {UnknownSubjectStructureSchema} from "../../../SubjectStructure.js";
import {z} from "zod";
import {getSubject} from "../../../../store.js";
import {StructureSubject} from "../StructureSubject.js";

export const getStructure = async <S extends typeof UnknownSubjectStructureSchema>(subjectId: string, structure: S): Promise<z.infer<S>> => {
  const subject = await getSubject(subjectId, StructureSubject)
  if(!subject) throw new Error(`Couldn't find structure subject ${subjectId}`)
  return structure.parse(subject.structure)
}