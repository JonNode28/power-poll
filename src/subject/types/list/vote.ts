import {ListSubject, ListSubjectValue, ListSubjectValueReason} from "./ListSubject.js";
import {VoteFn} from "../SubjectTypeDefinition.js";
import {addValueVote} from "../addVote.js";
import {select, Separator} from "@inquirer/prompts";
import {getSubject, getSubjects} from "../../../store.js";
import {StructureSubject} from "../structure/StructureSubject.js";
import {validateSubjectStructure} from "../../validateSubjectStructure.js";
import {ListSubjectStructure} from "./ListSubjectStructure.js";

export const vote: VoteFn<ListSubject, typeof ListSubjectValue, typeof ListSubjectValueReason> = async ({ subject, userId}) => {

  const selectedSubjectIds: string[] = []
  let suitableSubjects = await getSubjects()
  if (subject.structureInput){
    const listStructureSubject = await getSubject(subject.structureInput, StructureSubject)
    if (listStructureSubject?.structure) {
      const listStructure = ListSubjectStructure.parse(listStructureSubject.structure)
      if (listStructure.items) {
        const itemStructureSubjects = await Promise.all(listStructure.items.map(listItemStructureSubjectId => getSubject(listItemStructureSubjectId, StructureSubject)))
        suitableSubjects = suitableSubjects
          .filter(subject => itemStructureSubjects
            .some((itemStructureSubject) =>
              itemStructureSubject.structure
              && validateSubjectStructure(subject, itemStructureSubject.structure).valid))
      }
    }
  }
  if(!suitableSubjects.length){
    console.log('There are no suitable options for this list')
  }
  while (selectedSubjectIds.length !== suitableSubjects.length) {
    const voteValue = await select({
      message: `Please enter your text vote for ${subject.name}`,
      choices:
        [
          ...suitableSubjects
            .filter(subject => !selectedSubjectIds.includes(subject.id))
            .map(subject => ({
              name: subject.name,
              description: subject.description,
              value: subject.id
            })),
          new Separator(),
          {
            name: 'Done',
            value: undefined
          }
        ]
    })
    if(!voteValue) break
    selectedSubjectIds.push(voteValue)
  }

  return addValueVote(subject, selectedSubjectIds, userId)
}