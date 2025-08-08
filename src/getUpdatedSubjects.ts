import {getSubjects} from "./store.js";
import {Subject} from "./Subject.js";
import {getSubjectType} from "./subject-types/index.js";
import {ZodType} from "zod";

export const getUpdatedSubjects = async () => {
  const subjects = await getSubjects()
  const updatedSubjects: Record<string, Subject<ZodType, ZodType>> = {}
  for(const subject of subjects){
    const subjectType = getSubjectType(subject.type)
    updatedSubjects[subject.id] = await subjectType.update(subject, updatedSubjects)
  }
  return Object.values(updatedSubjects)
}