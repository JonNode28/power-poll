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

  const availableStructureSubjects: StructureSubject[] = allSubjects
    .filter((subject): subject is StructureSubject  =>
      subject.type === 'structure'
      && subject.value)
  const structure = await selectInput('Structure', true, availableStructureSubjects)

  return {
    ...generateBaseSubject({type: 'text', setup}),
    valueReason: 'Newly created',
    engagementInput: engagement.id,
    consensusInput: consensus.id,
    structureInput: structure?.id
  }
}