import {NumberDefinition} from "./number/index.js";
import {SubjectTypeDefinition} from "./SubjectTypeDefinition.js";
import {PercentDefinition} from "./percent/index.js";
import {TextDefinition} from "./text/index.js";
import {ZodType} from "zod";
import {Subject} from "../Subject.js";
import {ListDefinition} from "./list/index.js";

export const subjectTypes: Record<string, SubjectTypeDefinition<Subject<ZodType<any>>>> = {
  [NumberDefinition.id]: NumberDefinition,
  [PercentDefinition.id]: PercentDefinition,
  [TextDefinition.id]: TextDefinition,
  [ListDefinition.id]: ListDefinition
}

export default subjectTypes
