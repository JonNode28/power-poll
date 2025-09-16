import {z} from "zod";
import { SubjectSchema} from "../Subject.js";
import {ZodType} from "zod";
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