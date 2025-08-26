import {StructureSubject, StructureSubjectValueReason} from "./StructureSubject.js";
import {VoteFn} from "../SubjectTypeDefinition.js";
import {addValueVote} from "../addVote.js";
import {UnknownSubjectStructure} from "../../SubjectStructure.js";

export const vote: VoteFn<StructureSubject, typeof UnknownSubjectStructure, typeof StructureSubjectValueReason> = async ({ subject, userId}) => {
  console.log(`You voted FOR ${subject.name}`)
  return addValueVote(subject, true, userId)
}