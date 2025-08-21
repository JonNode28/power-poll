import {SubjectTypeDefinition} from "../SubjectTypeDefinition.js";
import {vote} from "./vote.js";
import {ListSubject, ListSubjectValue, ListSubjectValueReason} from "./ListSubject.js";
import {update} from "./update.js";
import {generateBaseSubject} from "../generateBaseSubject.js";



export const ListDefinition: SubjectTypeDefinition<ListSubject, typeof ListSubjectValue, typeof ListSubjectValueReason> = {
  id: 'list',
  name: 'List',
  description: 'Establishes consensus around a list of subjects',
  schema: ListSubject,
  inputs: [
    { id: 'engagement', type: 'percent' },
    { id: 'consensus', type: 'percent' },
  ],
  generate: (setup) => generateBaseSubject({ type: 'list', setup }),
  vote,
  update
}
