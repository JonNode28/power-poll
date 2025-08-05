import {SubjectTypeDefinition} from "../SubjectTypeDefinition.js";
import {PercentSubject} from "./PercentSubject.js";
import {vote} from "./vote.js";
import {update} from "./update.js";



export const PercentDefinition: SubjectTypeDefinition<PercentSubject> = {
  id: 'percent',
  name: 'Percent',
  description: 'Establishes consensus around a percentage (0-100)',
  schema: PercentSubject,
  inputs: [],
  generate: (setup) => ({
    id: 'unnamed-percent-subject',
    name: 'Un-named Percent Subject',
    description: '',
    author: 'system',
    inputs: {},
    status: 'pending',
    statusReason: [{ status: 'pending', reason: 'Newly created' }],
    value: 50,
    rejected: false,
    valueArchive: [],
    votes: {},
    voteArchive: [],
    ...setup,
    type: 'percent'
  }),
  vote,
  update
}