import {SubjectTypeDefinition} from "../SubjectTypeDefinition.js";
import {vote} from "./vote.js";
import {MapSubject, MapSubjectValue, MapSubjectValueReason} from "./MapSubject.js";
import {update} from "./update.js";
import {createSubject} from "./createSubject.js";
import {createStructure} from "./createStructure.js";
import {getInputs} from "./getInputs.js";

export const MapDefinition: SubjectTypeDefinition<MapSubject, typeof MapSubjectValue, typeof MapSubjectValueReason> = {
  id: 'map',
  name: 'Map',
  description: 'Establishes consensus around a map of subjects',
  subjectSchema: MapSubject,
  createSubject,
  createStructure,
  getInputs,
  vote,
  update
}
