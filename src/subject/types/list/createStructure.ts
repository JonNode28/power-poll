import {ListSubjectStructure} from "./ListSubjectStructure.js";
import {confirm, number, select, Separator} from "@inquirer/prompts";
import {getSubjects} from "../../../store.js";
import {UnknownSubjectStructure} from "../../SubjectStructure.js";
import {StructureSubject} from "../structure/StructureSubject.js";
import {CreateSubjectStructureFn} from "../SubjectTypeDefinition.js";

export const createStructure: CreateSubjectStructureFn = async () => {
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
    const selectedStructureSubjectIds: string[] = []
    do {
      const availableStructureSubjects: StructureSubject[] = allSubjects
        .filter((subject): subject is StructureSubject  =>
          subject.type === 'structure'
          && subject.value
          && !listStructure.items?.some(itemSubjectId => itemSubjectId === subject.id))
      if(!availableStructureSubjects.length){
        console.log(!selectedStructureSubjectIds.length
          ? 'There are no more structures to select'
          : 'There are no structures to select')
        break;
      }
      const selectedStructureSubject = await select({
        message: 'Select a structure to apply',
        choices: [
          ...availableStructureSubjects.map(subject => ({
            name: subject.name,
            value: subject!
          })),
          new Separator(),
          {
            name: 'Done',
            value: null
          }
        ]
      })
      if(!selectedStructureSubject) break;
      selectedStructureSubjectIds.push(selectedStructureSubject.id)
    } while (true)

    listStructure.items = selectedStructureSubjectIds
  }
  return listStructure
}