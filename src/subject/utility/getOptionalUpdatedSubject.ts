import {z} from "zod";
import { SubjectSchema, UnknownSubject} from "../Subject.js";
import {ZodType} from "zod";
import {getSubject, getSubjects, saveSubject} from "../../store.js";
import {getSubjectType} from "../types/index.js";
import {getUpdatedSubject} from "./getUpdatedSubject.js";

export const getOptionalUpdatedSubject = async <
  S extends SubjectSchema<V, VR>,
  V extends ZodType,
  VR extends ZodType
>(
  subjectId: string | undefined,
  SubjectSchema: S,
  updateId: string,
  dependencyChain: string[]
): Promise<z.infer<S> | undefined> => {
  if(!subjectId) return
  return getUpdatedSubject(subjectId, SubjectSchema, updateId, dependencyChain)
}