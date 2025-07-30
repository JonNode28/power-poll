import { SubjectStatus } from "./SubjectStatus.js";
import z from "zod";

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
export const generateStatusWithReason = async (criteria: [StatusCriteriaFn, ...StatusCriteriaFn[]]): Promise<StatusWithReasonResult> => {
  const results = await Promise.all(criteria.map(criteriaFn => criteriaFn()))
  if(results.some(result => result.status === 'pending')) return { status: 'pending', reason: results }
  if(results.some(result => result.status === 'rejected')) return { status: 'rejected', reason: results }
  return { status: 'active', reason: results }
}