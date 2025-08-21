import {NumberDefinition} from "./number/index.js";
import {SubjectTypeDefinition} from "./SubjectTypeDefinition.js";
import {PercentDefinition} from "./percent/index.js";
import {TextDefinition} from "./text/index.js";
import {ZodType} from "zod";
import {Subject} from "../Subject.js";
import {ListDefinition} from "./list/index.js";

const subjectTypes: Record<string, SubjectTypeDefinition<Subject<ZodType<any>, ZodType<any>>, ZodType<any>, ZodType<any>>> = {
  [NumberDefinition.id]: NumberDefinition,
  [PercentDefinition.id]: PercentDefinition,
  [TextDefinition.id]: TextDefinition,
  [ListDefinition.id]: ListDefinition
}

export default subjectTypes

export const getSubjectType = <S extends Subject<V, VR>, V extends ZodType, VR extends ZodType>(type: string): SubjectTypeDefinition<S, V, VR> => {
  const subjectType = subjectTypes[type]
  return subjectType as unknown as SubjectTypeDefinition<S, V, VR>
}

export const getSubjectTypeBySubject = <S extends Subject<V, VR>, V extends ZodType, VR extends ZodType>(subject: S): SubjectTypeDefinition<S, V, VR> => {
  const subjectType = subjectTypes[subject.type]
  return subjectType as unknown as SubjectTypeDefinition<S, V, VR>
}