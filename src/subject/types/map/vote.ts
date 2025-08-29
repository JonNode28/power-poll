import {MapSubject, MapSubjectValue, MapSubjectValueReason} from "./MapSubject.js";
import {VoteFn} from "../SubjectTypeDefinition.js";
import {addValueVote} from "../addVote.js";
import {input, select, confirm, Separator} from "@inquirer/prompts";
import {getSubjects} from "../../../store.js";

export const vote: VoteFn<MapSubject, typeof MapSubjectValue, typeof MapSubjectValueReason> = async ({ subject, userId}) => {

  const propertySubjectIds: Record<string, string> = {}
  const allSubjects = await getSubjects()
  while (Object.keys(propertySubjectIds).length !== allSubjects.length) {
    const votedPropertyKey = await input({
      message: 'Please enter the property key'
    })
    const votedSubjectId = await select({
      message: `Please enter your text vote for ${subject.name}`,
      choices:
        [
          ...allSubjects
            .filter(subject => !propertySubjectIds[subject.id])
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
    if(!votedSubjectId) break
    propertySubjectIds[votedPropertyKey] = votedSubjectId
    if(await confirm({ message: 'Done?', default: false })) break
  }


  return addValueVote<MapSubject, typeof MapSubjectValue, typeof MapSubjectValueReason>(subject, propertySubjectIds, userId)
}