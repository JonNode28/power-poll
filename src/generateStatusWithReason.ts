import { SubjectStatus } from "./SubjectStatus.js";
import z from "zod";
import {createSubjectSchema, isRejected, Subject} from "./Subject.js";
import {ZodType} from "zod";

export const CriteriaResult = z.object({
  status: SubjectStatus,
  reason: z.string()
})

export type CriteriaResult = z.infer<typeof CriteriaResult>

interface StatusCriteriaFn {
  (): CriteriaResult | Promise<CriteriaResult>
}
interface StatusWithReasonResult {
  status: SubjectStatus
  reason: CriteriaResult[]
}

const rejectionCriteria = <S extends ZodType<any>>(subject: z.infer<ReturnType<typeof createSubjectSchema<S>>>):CriteriaResult => {
  const allVotes = Object.values(subject.votes)
  const rejectionCount = allVotes.filter(vote => isRejected(vote)).length
  const rejectionRate = rejectionCount / allVotes.length
  const rejected = rejectionRate >= 0.5
  return { status: rejected ? 'rejected' : 'active', reason: `${rejected ? 'More' : 'Less'} than 50% (${rejectionRate * 100}%) of votes were rejections`}
}

export const generateStatusWithReason = async <S extends ZodType<any>>(
  subject: z.infer<ReturnType<typeof createSubjectSchema<S>>>,
  criteria: [StatusCriteriaFn, ...StatusCriteriaFn[]]): Promise<StatusWithReasonResult> => {
  const results = await Promise.all([
    rejectionCriteria(subject),
    ...criteria.map(criteriaFn => criteriaFn())
  ])
  if(results.some(result => result.status === 'rejected')) return { status: 'rejected', reason: results }
  if(results.some(result => result.status === 'pending')) return { status: 'pending', reason: results }
  return { status: 'active', reason: results }
}