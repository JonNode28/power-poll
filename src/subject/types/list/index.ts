import {SubjectTypeDefinition} from "../SubjectTypeDefinition.js";
import {vote} from "./vote.js";
import {ListSubject, ListSubjectValue, ListSubjectValueReason} from "./ListSubject.js";
import {update} from "./update.js";
import {generateBaseSubject} from "../generateBaseSubject.js";
import {getSubjects} from "../../../store.js";
import {selectInput} from "../../selectInput.js";
import {StructureSubject} from "../structure/StructureSubject.js";
import {ListSubjectStructure} from "./ListSubjectStructure.js";
import {confirm, number, select, Separator} from '@inquirer/prompts';
import {UnknownSubjectStructure} from "../../SubjectStructure.js";

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
    if (!engagement) return

    const consensus = await selectInput('Consensus', false, percentSubjects)
    if (!consensus) return

    const listSubjectStructures = allSubjects.filter(subject =>
      subject.type === 'structure' && StructureSubject.parse(subject).value?.type === 'list')
    const structure = await selectInput('Structure', true, listSubjectStructures)

    return {
      ...newSubject,
      valueReason: [ 'Newly created' ],
      engagementInput: engagement.id,
      consensusInput: consensus.id,
      structureInput: structure?.id
    }
  },
  createStructure: async () => {
    const listStructure: ListSubjectStructure = {type: 'list'}
    if (await confirm({ message: 'Set a minimum number of items?' })) {
      const min = await number({message: 'Enter the minimum number of items'})
      if (min !== undefined) listStructure.min = min
    }
    if (await confirm({message: 'Set a maximum number of items?'})) {
      const max = await number({message: 'Enter the maximum number of items'})
      if (max !== undefined) listStructure.max = max
    }
    const itemStructureType = await select({
      message: 'What type of structure would you like to use?',
      choices: [
        {name: 'Items', description: 'Each item in the list must meet at least one structure', value: 'items'},
        {name: 'None', description: 'Items can have any structure', value: 'none'},
      ]
    })
    if (itemStructureType === 'items') {
      const allSubjects = await getSubjects()
      let selectedStructure: UnknownSubjectStructure | null
      const selectedStructures: UnknownSubjectStructure[] = []
      do {
        const availableStructureSubjects: StructureSubject[] = allSubjects
          .filter((subject): subject is StructureSubject  =>
            subject.type === 'structure'
            && subject.value
            && !listStructure.items?.some(item => item.id === subject.id))
        if(!availableStructureSubjects.length){
          console.log(!selectedStructures.length
            ? 'There are no more structures to select'
            : 'There are no structures to select')
          break;
        }
        selectedStructure = await select({
          message: 'Select a structure to apply',
          choices: [
            ...availableStructureSubjects.map(subject => ({
              name: subject.name,
              value: subject.value!
            })),
            new Separator(),
            {
              name: 'Done',
              value: null
            }
          ]
        })
        if(selectedStructure) selectedStructures.push(selectedStructure)
      } while (selectedStructure)

      listStructure.items = selectedStructures
    }
    return listStructure
  },
  getInputs: (subject: ListSubject) => ([
    {
      name: 'Engagement',
      description: 'The subject used to determine the engagement threshold',
      subjectId: subject.engagementInput,
      optional: false
    },
    {
      name: 'Consensus',
      description: 'The subject used to determine the consensus threshold',
      subjectId: subject.consensusInput,
      optional: false
    },
    {
      name: 'Structure',
      description: 'The subject used to determine the structure threshold',
      subjectId: subject.structureInput,
      optional: true
    },
  ]),
  vote,
  update
}
