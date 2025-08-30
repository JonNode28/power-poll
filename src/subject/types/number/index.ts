import {SubjectTypeDefinition} from "../SubjectTypeDefinition.js";
import {vote} from "./vote.js";
import {NumberSubject} from "./NumberSubject.js";
import {update} from "./update.js";
import {generateBaseSubject} from "../generateBaseSubject.js";
import {ZodType} from "zod";
import {getSubjects} from "../../../store.js";
import {selectInput} from "../../selectInput.js";
import {createSubject} from "./createSubject.js";
import {getInputs} from "./getInputs.js";



export const NumberDefinition: SubjectTypeDefinition<NumberSubject, ZodType<number>, ZodType<string>> = {
  id: 'number',
  name: 'Number',
  description: 'Establishes consensus around a number',
  subjectSchema: NumberSubject,
  createSubject,
  getInputs,
  vote,
  update
}
