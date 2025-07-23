import {z} from "zod";
import {getSubjects, saveSubject} from "./store.js";
import subjectTypes from "./subject-types/index.js";
import { Subject } from "./Subject.js";

export const getUpdatedInputSubject = async <T extends typeof Subject>(subjectId: string | undefined, Subject: T, updatedSubjects: Record<string, Subject>): Promise<z.infer<T> | undefined> => {
  if(!subjectId) return
  const alreadyUpdatedSubject = updatedSubjects[subjectId]
  if(alreadyUpdatedSubject) return Subject.parse(alreadyUpdatedSubject)
  const subject = (await getSubjects())
    .find(eachSubject => eachSubject.id === subjectId)
  if(!subject) return
  const subjectTypeDefinition = subjectTypes[subject.type]
  const updatedSubject = await subjectTypeDefinition.update(subject, updatedSubjects)
  await saveSubject(updatedSubject)
  updatedSubjects[updatedSubject.id] = updatedSubject
  return Subject.parse(updatedSubject)
}