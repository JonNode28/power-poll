import {z} from "zod";
import { SubjectSchema, UnknownSubject} from "./Subject.js";
import {ZodType} from "zod";
import {getSubject, getSubjects, saveSubject} from "../store.js";
import {getSubjectType} from "./types/index.js";

export const getUpdatedSubject = async <
  S extends SubjectSchema<V, VR>,
  V extends ZodType,
  VR extends ZodType
>(
  subjectId: string,
  SubjectSchema: S,
  updatedSubjectsCache: Record<string, UnknownSubject>
): Promise<z.infer<S>> => {
  const alreadyUpdatedSubject = updatedSubjectsCache[subjectId]
  if(alreadyUpdatedSubject) return SubjectSchema.parse(alreadyUpdatedSubject)
  const subject = await getSubject(subjectId, UnknownSubject)
  const subjectTypeDefinition = getSubjectType(subject.type)
  const updatedSubject = await subjectTypeDefinition.update(subject, updatedSubjectsCache)
  await saveSubject(updatedSubject)
  updatedSubjectsCache[updatedSubject.id] = updatedSubject
  return SubjectSchema.parse(updatedSubject)
}