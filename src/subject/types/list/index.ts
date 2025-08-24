import {SubjectTypeDefinition} from "../SubjectTypeDefinition.js";
import {vote} from "./vote.js";
import {ListSubject, ListSubjectValue, ListSubjectValueReason} from "./ListSubject.js";
import {update} from "./update.js";
import {generateBaseSubject} from "../generateBaseSubject.js";
import {getSubjects} from "../../../store.js";
import {selectInput} from "../../selectInput.js";
import {StructureSubject} from "../structure/StructureSubject.js";

export const ListDefinition: SubjectTypeDefinition<ListSubject, typeof ListSubjectValue, typeof ListSubjectValueReason> = {
  id: 'list',
  name: 'List',
  description: 'Establishes consensus around a list of subjects',
  subjectSchema: ListSubject,
  createSubject: async (setup) => {
    const newSubject = generateBaseSubject({type: 'list', setup})

    const allSubjects = await getSubjects()
    const percentSubjects = allSubjects.filter(subject => subject.type === 'percent')

    const engagement = await selectInput('Engagement', false, percentSubjects)
    if(!engagement) return

    const consensus = await selectInput('Consensus', false, percentSubjects)
    if(!consensus) return

    const listSubjectStructures = allSubjects.filter(subject =>
      subject.type === 'structure' && StructureSubject.parse(subject).structure.type === 'list')
    const structure = await selectInput('Structure', true, listSubjectStructures)

    return {
      ...newSubject,
      engagementInput: engagement.id,
      consensusInput: consensus.id,
      structureInput: structure?.id
    }
  },
  getInputs: (subject: ListSubject) => ([
    { name: 'Engagement', description: 'The subject used to determine the engagement threshold', subjectId: subject.engagementInput, optional: false },
    { name: 'Consensus', description: 'The subject used to determine the consensus threshold', subjectId: subject.consensusInput, optional: false },
    { name: 'Structure', description: 'The subject used to determine the structure threshold', subjectId: subject.structureInput, optional: true },
  ]),
  vote,
  update
}
