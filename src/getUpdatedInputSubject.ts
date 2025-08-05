import {z} from "zod";
import {getSubjects, saveSubject} from "./store.js";
import subjectTypes from "./subject-types/index.js";
import {Subject, SubjectSchema} from "./Subject.js";
import {ZodType} from "zod";

export const getUpdatedInputSubject = async <V extends ZodType<any>, S extends SubjectSchema<V>>(subjectId: string | undefined, SubjectSchema: S, updatedSubjects: Record<string, Subject>): Promise<z.infer<S> | undefined> => {
  if(!subjectId) return
  const alreadyUpdatedSubject = updatedSubjects[subjectId]
  if(alreadyUpdatedSubject) return SubjectSchema.parse(alreadyUpdatedSubject)
  const subject = (await getSubjects())
    .find(eachSubject => eachSubject.id === subjectId)
  if(!subject) return
  const subjectTypeDefinition = subjectTypes[subject.type]
  const updatedSubject = await subjectTypeDefinition.update(subject, updatedSubjects)
  await saveSubject(updatedSubject)
  updatedSubjects[updatedSubject.id] = updatedSubject
  return SubjectSchema.parse(updatedSubject)
}