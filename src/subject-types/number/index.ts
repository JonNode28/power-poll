import {SubjectTypeDefinition} from "../SubjectTypeDefinition.js";
import {vote} from "./vote.js";
import {NumberSubject} from "./NumberSubject.js";
import {update} from "./update.js";
import {generateBaseSubject} from "../generateBaseSubject.js";
import {ZodType} from "zod";



export const NumberDefinition: SubjectTypeDefinition<NumberSubject, ZodType<number>, ZodType<string>> = {
  id: 'number',
  name: 'Number',
  description: 'Establishes consensus around a number',
  schema: NumberSubject,
  inputs: [
    { id: 'min', type: 'number', optional: true },
    { id: 'max', type: 'number', optional: true },
    { id: 'engagement', type: 'percent' }
  ],
  generate: (setup) => generateBaseSubject({ type: 'number', setup }),
  vote,
  update
}
