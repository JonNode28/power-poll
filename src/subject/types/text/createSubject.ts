import {CreateSubjectFn} from "../SubjectTypeDefinition.js";
import {TextSubject, TextSubjectValue, TextSubjectValueReason} from "./TextSubject.js";
import {getSubjects} from "../../../store.js";
import {selectInput} from "../../selectInput.js";
import {confirm, select, Separator} from "@inquirer/prompts";
import {StructureSubject} from "../structure/StructureSubject.js";
import {generateBaseSubject} from "../generateBaseSubject.js";

export const createSubject: CreateSubjectFn<TextSubject, typeof TextSubjectValue, typeof TextSubjectValueReason> = async (setup) => {
  const allSubjects = await getSubjects()
  const percentSubjects = allSubjects.filter(subject => subject.type === 'percent')

  const engagement = await selectInput('Engagement', false, percentSubjects)
  if(!engagement) return

  const consensus = await selectInput('Consensus', false, percentSubjects)
  if(!consensus) return

  let selectedStructureSubjectId: string | undefined
  if(await confirm({ message: 'Applqy structure?' })){
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
    valueReason: 'Newly created',
    engagementInput: engagement.id,
    consensusInput: consensus.id,
    structureInput: selectedStructureSubjectId
  }
}