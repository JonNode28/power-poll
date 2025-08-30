import {StructureSubject, StructureSubjectValue, StructureSubjectValueReason} from "./StructureSubject.js";
import {CreateSubjectFn} from "../SubjectTypeDefinition.js";
import {getSubjects} from "../../../store.js";
import {selectInput} from "../../selectInput.js";
import {getAllSubjectTypes} from "../index.js";
import {select} from "@inquirer/prompts";
import {generateBaseSubject} from "../generateBaseSubject.js";

export const createSubject: CreateSubjectFn<StructureSubject, typeof StructureSubjectValue, typeof StructureSubjectValueReason> = async (setup) => {
  const allSubjects = await getSubjects()
  const engagement = await selectInput('engagement', true, allSubjects.filter(subject => subject.type === 'percent'))
  const subjectsWithStructure = getAllSubjectTypes()
    .filter(subjectType => subjectType.createStructure)
  if(!subjectsWithStructure.length) throw new Error('There are no subjects with structure')
  const structureSubjectType = await select({
    message: 'What type of structure would you like to make?',
    choices: subjectsWithStructure
      .map(subjectType => ({
        name: subjectType.name,
        value: subjectType
      }))
  })

  if(!structureSubjectType.createStructure) throw new Error()

  return {
    ...generateBaseSubject({type: 'structure', setup}),
    valueReason: [ 'Newly created' ],
    engagementInput: engagement?.id,
    structure: await structureSubjectType.createStructure(),
    value: true
  }
}