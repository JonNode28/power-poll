import {getSubjects} from "./store.js";
import {Subject} from "./Subject.js";
import subjectTypes from "./subject-types/index.js";

export const getUpdatedSubjects = async () => {
  const subjects = await getSubjects()
  const updatedSubjects: Record<string, Subject> = {}
  for(const subject of subjects){
    const subjectType = subjectTypes[subject.type]
    updatedSubjects[subject.id] = await subjectType.update(subject, updatedSubjects)
  }
  return updatedSubjects
}