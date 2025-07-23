import {NumberDefinition} from "./number/index.js";
import {SubjectTypeDefinition} from "./SubjectTypeDefinition.js";
import {PercentDefinition} from "./percent/index.js";
import {ZodObject} from "zod";
import {Subject} from "../Subject.js";

export const subjectTypes: Record<string, SubjectTypeDefinition<typeof Subject>> = {
  [NumberDefinition.id]: NumberDefinition,
  [PercentDefinition.id]: PercentDefinition,
}

export default subjectTypes