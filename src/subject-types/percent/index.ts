import {SubjectTypeDefinition} from "../SubjectTypeDefinition.js";
import {PercentSubject} from "./PercentSubject.js";
import {vote} from "./vote.js";
import {update} from "./update.js";



export const PercentDefinition: SubjectTypeDefinition<typeof PercentSubject> = {
  id: 'percent',
  name: 'Percent',
  description: 'Establishes consensus around a percentage (0-100)',
  schema: PercentSubject,
  inputs: [],
  generate: () => ({
    value: 50,
    votes: {}
  }),
  vote,
  update
}