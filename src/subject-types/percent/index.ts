import {SubjectTypeDefinition} from "../SubjectTypeDefinition.js";
import {PercentSubject} from "./PercentSubject.js";
import {vote} from "./vote.js";
import {update} from "./update.js";
import {generateBaseSubject} from "../generateBaseSubject.js";



export const PercentDefinition: SubjectTypeDefinition<PercentSubject> = {
  id: 'percent',
  name: 'Percent',
  description: 'Establishes consensus around a percentage (0-100)',
  schema: PercentSubject,
  inputs: [],
  generate: (setup) => generateBaseSubject({ setup }),
  vote,
  update
}