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

    let selectedStructureSubjectId: string | undefined
    if(await confirm({ message: 'Apply structure?' })){
      const availableStructureSubjects: StructureSubject[] = allSubjects
        .filter((subject): subject is StructureSubject  =>
          subject.type === 'structure'
          && subject.value)
      selectedStructureSubjectId = await select({
        message: 'Select a structure to apply',
        choices: [
          ...availableStructureSubjects.map(subject => ({
            name: subject.name,
            value: subject.id
          })),
          new Separator(),
          {
            name: 'Cancel',
            value: undefined
          }
        ]
      })
    }

    return {
      ...generateBaseSubject({type: 'text', setup}),
      engagementInput: engagement.id,
      consensusInput: consensus.id,
      structureInput: selectedStructureSubjectId
    }
  },
  createStructure: async () => {
    const textStructure: TextSubjectStructure = { type: 'text' }
    if (await confirm({ message: 'Set a minimum text length?' })) {
      const min = await number({message: 'Enter the minimum text length'})
      if (min !== undefined) textStructure.min = min
    }
    if (await confirm({message: 'Set a maximum text length?'})) {
      const max = await number({message: 'Enter the maximum text length'})
      if (max !== undefined) textStructure.max = max
    }
    return textStructure
  },
  getInputs: (subject: TextSubject) => ([
    { name: 'Engagement', description: 'The subject used to determine the engagement threshold', subjectId: subject.engagementInput, optional: false },
    { name: 'Consensus', description: 'The subject used to determine the consensus threshold', subjectId: subject.consensusInput, optional: false }
  ]),
  vote,
  update
}
