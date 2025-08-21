import {ListSubject, ListSubjectValue, ListSubjectValueReason} from "./ListSubject.js";
import {VoteFn} from "../SubjectTypeDefinition.js";
import {addValueVote} from "../addVote.js";
import {select, Separator} from "@inquirer/prompts";
import {getSubjects} from "../../../store.js";

export const vote: VoteFn<ListSubject, typeof ListSubjectValue, typeof ListSubjectValueReason> = async ({ subject, userId}) => {

  const selectedSubjectIds: string[] = []
  const allSubjects = await getSubjects()
  while (selectedSubjectIds.length !== allSubjects.length) {
    const voteValue = await select({
      message: `Please enter your text vote for ${subject.name}`,
      choices:
        [
          ...allSubjects
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