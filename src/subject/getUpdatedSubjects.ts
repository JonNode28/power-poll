import {Subject, UnknownSubject} from "./Subject.js";
import {ZodType} from "zod";
import {getSubject, getSubjects} from "../store.js";
import {getSubjectType} from "./types/index.js";
import {getUpdatedSubject} from "./getUpdatedSubject.js";

export const getUpdatedSubjects = async (
  subjectIds?: string[],
  updatedSubjects?: Record<string, UnknownSubject>
) => {
  if(!subjectIds) subjectIds = (await getSubjects(subjectIds)).map(subject => subject.id)
  if(!updatedSubjects) updatedSubjects = {}
  return Promise.all(subjectIds.map(subjectId => getUpdatedSubject(subjectId, UnknownSubject, updatedSubjects)))
}