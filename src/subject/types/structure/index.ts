import {SubjectTypeDefinition} from "../SubjectTypeDefinition.js";
import {vote} from "./vote.js";
import {StructureSubject, StructureSubjectValue, StructureSubjectValueReason} from "./StructureSubject.js";
import {update} from "./update.js";
import {generateBaseSubject} from "../generateBaseSubject.js";
import {select} from "@inquirer/prompts";
import {getAllSubjectTypes} from "../index.js";
import {getSubjects} from "../../../store.js";
import {selectInput} from "../../selectInput.js";

export const StructureDefinition: SubjectTypeDefinition<StructureSubject, typeof StructureSubjectValue, typeof StructureSubjectValueReason> = {
  id: 'structure',
  name: 'Structure',
  description: 'Consensus around a subject structure',
  subjectSchema: StructureSubject,
  createSubject: async (setup) => {
    const allSubjects = await getSubjects()
    const engagement = await selectInput('engagement', true, allSubjects.filter(subject => subject.type === 'percent'))
    const structureSubjectType = await select({
      message: 'What type of structure would you like to make?',
      choices: getAllSubjectTypes()
        .filter(subjectType => subjectType.createStructure)
        .map(subjectType => ({
          name: subjectType.name,
          value: subjectType
        }))
    })

    if(!structureSubjectType.createStructure) throw new Error()

    return {
      ...generateBaseSubject({ type: 'structure', setup }),
      engagementInput: engagement?.id,
      structure: {
        type: structureSubjectType.id,
        body: structureSubjectType.createStructure()
      }
    }
  },
  vote,
  update
}
