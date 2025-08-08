import {SubjectTypeDefinition} from "../SubjectTypeDefinition.js";
import {vote} from "./vote.js";
import {TextSubject} from "./TextSubject.js";
import {getUsers} from "../../store.js";
import {PercentSubject} from "../percent/PercentSubject.js";
import {getUpdatedInputSubject} from "../../getUpdatedInputSubject.js";
import {update} from "./update.js";
import {generateBaseSubject} from "../generateBaseSubject.js";
import {ZodType} from "zod";



export const TextDefinition: SubjectTypeDefinition<TextSubject, ZodType<string>, ZodType<string>> = {
  id: 'text',
  name: 'Text',
  description: 'Establishes consensus around a piece of text',
  schema: TextSubject,
  inputs: [
    { id: 'engagement', type: 'percent' },
    { id: 'consensus', type: 'percent' }
  ],
  generate: (setup) => generateBaseSubject({ type: 'text', setup }),
  vote,
  update
}
