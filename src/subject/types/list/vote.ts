import {ListSubject, ListSubjectValue, ListSubjectValueReason} from "./ListSubject.js";
import {VoteFn} from "../SubjectTypeDefinition.js";
import {addValueVote} from "../addVote.js";
import {select, Separator} from "@inquirer/prompts";
import {getSubjects} from "../../../store.js";
import {filterValidSubjectsByStructureId} from "./utility/filter.js";

export const vote: VoteFn<ListSubject, typeof ListSubjectValue, typeof ListSubjectValueReason> = async ({ subject, userId}) => {
  let suitableSubjects = await  filterValidSubjectsByStructureId(await getSubjects(), subject.structureInput)

  if(!suitableSubjects.length){
    console.log('There are no suitable options for this list')
  }
  const selectedSubjectIds: string[] = []
  while (selectedSubjectIds.length !== suitableSubjects.length) {
    const voteValue = await select({
      message: `Please select the #${selectedSubjectIds.length + 1} subject for ${subject.name}`,
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