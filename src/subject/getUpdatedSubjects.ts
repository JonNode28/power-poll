import {Subject} from "./Subject.js";
import {ZodType} from "zod";
import {getSubjects} from "../store.js";
import {getSubjectType} from "./types/index.js";

export const getUpdatedSubjects = async () => {
  const subjects = await getSubjects()
  const updatedSubjects: Record<string, Subject<ZodType, ZodType>> = {}
  for(const subject of subjects){
    const subjectType = getSubjectType(subject.type)
    updatedSubjects[subject.id] = await subjectType.update(subject, updatedSubjects)
  }
  return Object.values(updatedSubjects)
}