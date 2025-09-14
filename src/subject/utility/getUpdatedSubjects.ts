import {Subject, UnknownSubject} from "../Subject.js";
import {ZodType} from "zod";
import {getSubject, getSubjects} from "../../store.js";
import {getSubjectType} from "../types/index.js";
import {getUpdatedSubject} from "./getUpdatedSubject.js";

export const getUpdatedSubjects = async (
  subjectIds?: string[],
  updateId?: string,
  dependencyChain?: string[]
) => {
  if(!subjectIds) subjectIds = (await getSubjects(subjectIds)).map(subject => subject.id)
  if(!updateId) updateId = new Date().getTime().toString()
  if(!dependencyChain) dependencyChain = []
  return Promise.all(subjectIds.map(subjectId => getUpdatedSubject(subjectId, UnknownSubject, updateId, dependencyChain)))
}