import {StructureSubject, StructureSubjectValue, StructureSubjectValueReason} from "./StructureSubject.js";
import {VoteFn} from "../SubjectTypeDefinition.js";
import {addValueVote} from "../addVote.js";

export const vote: VoteFn<StructureSubject, typeof StructureSubjectValue, typeof StructureSubjectValueReason> = async ({ subject, userId}) => {
  console.log(`You voted FOR ${subject.name}`)
  return addValueVote(subject, true, userId)
}