import {ListDefinition} from "./list/index.js";
import {NumberDefinition} from "./number/index.js";
import {PercentDefinition} from "./percent/index.js";
import {StructureDefinition} from "./structure/index.js";
import {Subject, UnknownSubject} from "../Subject.js";
import {SubjectTypeDefinition} from "./SubjectTypeDefinition.js";
import {TextDefinition} from "./text/index.js";
import {ZodType, ZodUnknown} from "zod";

const subjectTypes: Record<string, unknown> = {
  [ListDefinition.id]: ListDefinition,
  [NumberDefinition.id]: NumberDefinition,
  [PercentDefinition.id]: PercentDefinition,
  [StructureDefinition.id]: StructureDefinition,
  [TextDefinition.id]: TextDefinition,
}

export const getSubjectType = <S extends Subject<V, VR>, V extends ZodType, VR extends ZodType>(type: string): SubjectTypeDefinition<S, V, VR> => {
  const subjectType = subjectTypes[type]
  return subjectType as SubjectTypeDefinition<S, V, VR>
}

export const getSubjectTypeBySubject = <S extends Subject<V, VR>, V extends ZodType, VR extends ZodType>(subject: S): SubjectTypeDefinition<S, V, VR> => {
  const subjectType = subjectTypes[subject.type]
  return subjectType as SubjectTypeDefinition<S, V, VR>
}

export const getAllSubjectTypes = () => {
  return Object.values(subjectTypes) as SubjectTypeDefinition<UnknownSubject, ZodUnknown, ZodUnknown>[]
}