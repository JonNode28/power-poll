import {SubjectTypeDefinition} from "../SubjectTypeDefinition.js";
import {vote} from "./vote.js";
import {NumberSubject} from "./NumberSubject.js";
import {update} from "./update.js";
import {generateBaseSubject} from "../generateBaseSubject.js";
import {ZodType} from "zod";
import {getSubjects} from "../../../store.js";
import {selectInput} from "../../selectInput.js";



export const NumberDefinition: SubjectTypeDefinition<NumberSubject, ZodType<number>, ZodType<string>> = {
  id: 'number',
  name: 'Number',
  description: 'Establishes consensus around a number',
  subjectSchema: NumberSubject,
  createSubject: async (setup) => {
    const allSubjects = await getSubjects()
    const numberSubjects = allSubjects.filter(subject => subject.type === 'number')

    const min = await selectInput('Min', true, numberSubjects)
    const max = await selectInput('Max', true, numberSubjects)
    const engagement = await selectInput('engagement', true, allSubjects.filter(subject => subject.type === 'percent'))

    return {
      ...generateBaseSubject({ type: 'number', setup }),
      valueReason: 'Newly created',
      minInput: min?.id,
      maxInput: max?.id,
      engagementInput: engagement?.id
    }
  },
  getInputs: (subject: NumberSubject) => ([
    { name: 'Min', description: 'The minimum value allowed', subjectId: subject.minInput, optional: false },
    { name: 'Max', description: 'The maximum value allowed', subjectId: subject.maxInput, optional: false },
    { name: 'Engagement', description: 'The subject used to determine the engagement threshold', subjectId: subject.engagementInput, optional: false },
  ]),
  vote,
  update
}
