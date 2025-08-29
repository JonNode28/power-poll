import {getUpdatedInputSubject} from "../../getUpdatedInputSubject.js";
import {StructureSubject, StructureSubjectValue, StructureSubjectValueReason} from "./StructureSubject.js";
import {PercentSubject} from "../percent/PercentSubject.js";
import {UpdateFn} from "../SubjectTypeDefinition.js";
import {isRejected} from "../../Subject.js";
import {UnknownSubjectStructure} from "../../SubjectStructure.js";
import {generateStatusWithReason} from "../../status/generateStatusWithReason.js";
import {getEngagementThresholdMetStatusAndReason} from "../../status/getEngagementThresholdMetStatusAndReason.js";

interface CountItem {
  subjectId: string,
  count: {
    votes: number,
    score: number
  }
}

export const update: UpdateFn<StructureSubject, typeof StructureSubjectValue, typeof StructureSubjectValueReason> = async (subject, updatedSubjects) => {
  const engagementThresholdSubject = (await getUpdatedInputSubject(subject.engagementInput, PercentSubject, updatedSubjects))

  const allVotes = Object.values(subject.votes)
  const { accepted, rejected } = allVotes.reduce<{ accepted: number, rejected: number }>((a, c) => {
    if(isRejected(c)) a.rejected++
    else a.accepted++
    return a
  },{ accepted: 0, rejected: 0 })

  const { status, reason } = await generateStatusWithReason(subject, [
    () => getEngagementThresholdMetStatusAndReason(allVotes.length, engagementThresholdSubject)
  ])

  return {
    ...subject,
    valueReason: [
      `${accepted} accepted the structure`,
      `${rejected} rejected the structure`,
    ],
    status: status,
    statusReason: reason
  }
}