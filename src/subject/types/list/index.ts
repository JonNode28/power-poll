import {SubjectTypeDefinition} from "../SubjectTypeDefinition.js";
import {vote} from "./vote.js";
import {ListSubject, ListSubjectValue, ListSubjectValueReason} from "./ListSubject.js";
import {update} from "./update.js";
import {createSubject} from "./createSubject.js";
import {createStructure} from "./createStructure.js";
import {getInputs} from "./getInputs.js";
import {validate} from "./validate.js";

export const ListDefinition: SubjectTypeDefinition<ListSubject, typeof ListSubjectValue, typeof ListSubjectValueReason> = {
  id: 'list',
  name: 'List',
  description: 'Establishes consensus around a list of subjects',
  subjectSchema: ListSubject,
  createStructure,
  createSubject,
  getInputs,
  update,
  validate,
  vote,
}
