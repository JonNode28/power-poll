import {NumberDefinition} from "./number/index.js";
import {SubjectTypeDefinition} from "./SubjectTypeDefinition.js";
import {PercentDefinition} from "./percent/index.js";
import {ZodObject} from "zod";
import {Subject} from "../Subject.js";
import {TextDefinition} from "./text/index.js";

export const subjectTypes: Record<string, SubjectTypeDefinition<typeof Subject>> = {
  [NumberDefinition.id]: NumberDefinition,
  [PercentDefinition.id]: PercentDefinition,
  [TextDefinition.id]: TextDefinition
}

export default subjectTypes