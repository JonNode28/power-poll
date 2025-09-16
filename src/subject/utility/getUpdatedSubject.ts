import {z} from "zod";
import { SubjectSchema, UnknownSubject} from "../Subject.js";
import {ZodType} from "zod";
import {getSubject, setSubject} from "../../store.js";
import {getSubjectType} from "../types/index.js";

const updateCache: Record<string, UnknownSubject> = {}

export const getUpdatedSubject = async <
  S extends SubjectSchema<V, VR>,
  V extends ZodType,
  VR extends ZodType
>(
  subjectId: string,
  SubjectSchema: S,
  updateId: string,
  dependencyChain: string[]
): Promise<z.infer<S>> => {
  const subject = await getSubject(subjectId, UnknownSubject)
  const subjectTypeDefinition = getSubjectType(subject.type)
  const updatedSubject = await subjectTypeDefinition.update(subject, updateId, [ ...dependencyChain, subjectId ])
  const cacheKey = `${updateId}.${subjectId}`
  if(updateCache[cacheKey]) return SubjectSchema.parse(updateCache[cacheKey])
  updateCache[cacheKey] = updatedSubject
  await setSubject(updatedSubject, dependencyChain)
  return SubjectSchema.parse(updatedSubject)
}