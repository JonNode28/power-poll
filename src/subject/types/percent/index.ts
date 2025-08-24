import {SubjectTypeDefinition} from "../SubjectTypeDefinition.js";
import {PercentSubject} from "./PercentSubject.js";
import {vote} from "./vote.js";
import {update} from "./update.js";
import {generateBaseSubject} from "../generateBaseSubject.js";
import {ZodType} from "zod";



export const PercentDefinition: SubjectTypeDefinition<PercentSubject, ZodType<number>, ZodType<string>> = {
  id: 'percent',
  name: 'Percent',
  description: 'Establishes consensus around a percentage (0-100)',
  subjectSchema: PercentSubject,
  createSubject: async (setup) => generateBaseSubject({ type: 'percent', setup }),
  vote,
  update
}