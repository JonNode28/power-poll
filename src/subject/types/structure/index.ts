import {SubjectTypeDefinition} from "../SubjectTypeDefinition.js";
import {vote} from "./vote.js";
import {StructureSubject, StructureSubjectValue, StructureSubjectValueReason} from "./StructureSubject.js";
import {update} from "./update.js";
import {createSubject} from "./createSubject.js";

export const StructureDefinition: SubjectTypeDefinition<StructureSubject, typeof StructureSubjectValue, typeof StructureSubjectValueReason> = {
  id: 'structure',
  name: 'Structure',
  description: 'Consensus around a subject structure',
  subjectSchema: StructureSubject,
  createSubject,
  vote,
  update
}
