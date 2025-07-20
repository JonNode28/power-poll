import {NumberDefinition} from "./number/index.js";
import {SubjectTypeDefinition} from "./SubjectTypeDefinition.js";
import {PercentDefinition} from "./percent/index.js";

export const subjectTypes: Record<string, SubjectTypeDefinition> = {
  [NumberDefinition.id]: NumberDefinition,
  [PercentDefinition.id]: PercentDefinition,
}

export default subjectTypes