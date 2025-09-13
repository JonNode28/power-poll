import {SubjectTypeDefinition} from "../SubjectTypeDefinition.js";
import {vote} from "./vote.js";
import {TextSubject} from "./TextSubject.js";
import {update} from "./update.js";
import {generateBaseSubject} from "../generateBaseSubject.js";
import {ZodType} from "zod";
import {selectInput} from "../../selectInput.js";
import {getSubjects} from "../../../store.js";
import {confirm} from '@inquirer/prompts';
import {StructureSubject} from "../structure/StructureSubject.js";
import {select, Separator} from "@inquirer/prompts";
import {TextSubjectStructure} from "./TextSubjectStructure.js";
import {number} from "@inquirer/prompts";
import {createSubject} from "./createSubject.js";
import {createStructure} from "./createStructure.js";
import {getInputs} from "./getInputs.js";
import {validate} from "./validate.js";

export const TextDefinition: SubjectTypeDefinition<TextSubject, ZodType<string>, ZodType<string>> = {
  id: 'text',
  name: 'Text',
  description: 'Establishes consensus around a piece of text',
  subjectSchema: TextSubject,
  createStructure,
  createSubject,
  getInputs,
  update,
  validate,
  vote,
}
