import {SubjectTypeDefinition} from "../SubjectTypeDefinition.js";
import {vote} from "./vote.js";
import {NumberSubject} from "./NumberSubject.js";
import {getUsers} from "../../store.js";
import {PercentSubject} from "../percent/PercentSubject.js";
import {getUpdatedInputSubject} from "../../getUpdatedInputSubject.js";
import {update} from "./update.js";



export const NumberDefinition: SubjectTypeDefinition<NumberSubject> = {
  id: 'number',
  name: 'Number',
  description: 'Establishes consensus around a number',
  schema: NumberSubject,
  inputs: [
    { id: 'min', type: 'number', optional: true },
    { id: 'max', type: 'number', optional: true },
    { id: 'engagement', type: 'percent' }
  ],
  generate: (setup) => ({
    id: 'unnamed-number-subject',
    name: 'Un-named Number Subject',
    description: '',
    author: 'system',
    inputs: {},
    status: 'pending',
    statusReason: [{ status: 'pending', reason: 'Newly created' }],
    value: undefined,
    rejected: false,
    valueArchive: [],
    votes: {},
    voteArchive: [],
    ...setup,
    type: 'number'
  }),
  vote,
  update
}
