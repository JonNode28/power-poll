import {PercentSubject} from "./subject-types/percent/PercentSubject.js";
import {getUsers} from "./store.js";
import {CriteriaResult} from "./generateStatusWithReason.js";

export const getEngagementThresholdMetStatusAndReason = async (voteCount: number, engagementThresholdSubject: PercentSubject | undefined): Promise<CriteriaResult> => {
  if(!engagementThresholdSubject) return { status: 'active', reason: 'No engagement threshold input is defined' }
  if(engagementThresholdSubject.status !== 'active') return { status: 'pending', reason: 'Engagement threshold input is pending' }
  const totalUserCount = Object.keys(await getUsers()).length
  const actualEngagementRate = (voteCount / totalUserCount) * 100
  const result = actualEngagementRate >= engagementThresholdSubject.value
  return {
    status: result ? 'active' : 'pending',
    reason: `Engagement ${Math.round(actualEngagementRate)}% is ${result ? 'above' : 'below'} threshold of ${engagementThresholdSubject.value}%`
  }
}