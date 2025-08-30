import {generateBaseSubject} from "../generateBaseSubject.js";
import {getSubjects} from "../../../store.js";
import {selectInput} from "../../selectInput.js";
import {StructureSubject} from "../structure/StructureSubject.js";
import {CreateSubjectFn} from "../SubjectTypeDefinition.js";
import {ListSubject, ListSubjectValue, ListSubjectValueReason} from "./ListSubject.js";

export const createSubject: CreateSubjectFn<ListSubject, typeof ListSubjectValue, typeof ListSubjectValueReason> = async (setup) => {
  const newSubject = generateBaseSubject({type: 'list', setup})

  const allSubjects = await getSubjects()
  const percentSubjects = allSubjects.filter(subject => subject.type === 'percent')

  const engagement = await selectInput('Engagement', false, percentSubjects)
  if (!engagement) return

  const consensus = await selectInput('Consensus', false, percentSubjects)
  if (!consensus) return

  const listSubjectStructures = allSubjects.filter(subject =>
    subject.type === 'structure' && StructureSubject.parse(subject).structure?.type === 'list')
  const structure = await selectInput('Structure', true, listSubjectStructures)

  return {
    ...newSubject,
    valueReason: [ 'Newly created' ],
    engagementInput: engagement.id,
    consensusInput: consensus.id,
    structureInput: structure?.id
  }
}