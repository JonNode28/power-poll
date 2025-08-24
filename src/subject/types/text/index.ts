import {SubjectTypeDefinition} from "../SubjectTypeDefinition.js";
import {vote} from "./vote.js";
import {TextSubject} from "./TextSubject.js";
import {update} from "./update.js";
import {generateBaseSubject} from "../generateBaseSubject.js";
import {ZodType} from "zod";
import {selectInput} from "../../selectInput.js";
import {getSubjects} from "../../../store.js";

export const TextDefinition: SubjectTypeDefinition<TextSubject, ZodType<string>, ZodType<string>> = {
  id: 'text',
  name: 'Text',
  description: 'Establishes consensus around a piece of text',
  subjectSchema: TextSubject,
  createSubject: async (setup) => {
    const allSubjects = await getSubjects()
    const percentSubjects = allSubjects.filter(subject => subject.type === 'percent')

    const engagement = await selectInput('Engagement', false, percentSubjects)
    if(!engagement) return

    const consensus = await selectInput('Consensus', false, percentSubjects)
    if(!consensus) return
    return {
      ...generateBaseSubject({type: 'text', setup}),
      engagementInput: engagement.id,
      consensusInput: consensus.id,
    }
  },
  getInputs: (subject: TextSubject) => ([
    { name: 'Engagement', description: 'The subject used to determine the engagement threshold', subjectId: subject.engagementInput, optional: false },
    { name: 'Consensus', description: 'The subject used to determine the consensus threshold', subjectId: subject.consensusInput, optional: false }
  ]),
  vote,
  update
}
