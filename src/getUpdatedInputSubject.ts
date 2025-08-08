import {z} from "zod";
import {getSubjects, saveSubject} from "./store.js";
import {getSubjectType} from "./subject-types/index.js";
import { SubjectSchema, UnknownSubject} from "./Subject.js";
import {ZodType} from "zod";

export const getUpdatedInputSubject = async <S extends SubjectSchema<V, VR>, V extends ZodType, VR extends ZodType>(subjectId: string | undefined, SubjectSchema: S, updatedSubjects: Record<string, UnknownSubject>): Promise<z.infer<S> | undefined> => {
  if(!subjectId) return
  const alreadyUpdatedSubject = updatedSubjects[subjectId]
  if(alreadyUpdatedSubject) return SubjectSchema.parse(alreadyUpdatedSubject)
  const subject = (await getSubjects())
    .find(eachSubject => eachSubject.id === subjectId)
  if(!subject) return
  const subjectTypeDefinition = getSubjectType(subject.type)
  const updatedSubject = await subjectTypeDefinition.update(subject, updatedSubjects)
  await saveSubject(updatedSubject)
  updatedSubjects[updatedSubject.id] = updatedSubject
  return SubjectSchema.parse(updatedSubject)
}