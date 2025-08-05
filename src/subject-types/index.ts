import {NumberDefinition} from "./number/index.js";
import {SubjectTypeDefinition} from "./SubjectTypeDefinition.js";
import {PercentDefinition} from "./percent/index.js";
import {TextDefinition} from "./text/index.js";
import {ZodType} from "zod";
import {Subject} from "../Subject.js";

export const subjectTypes: Record<string, SubjectTypeDefinition<Subject<ZodType<any>>>> = {
  [NumberDefinition.id]: NumberDefinition,
  [PercentDefinition.id]: PercentDefinition,
  [TextDefinition.id]: TextDefinition
}

export default subjectTypes
