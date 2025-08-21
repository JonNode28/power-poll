import {CriteriaResult} from "./generateStatusWithReason.js";
import {getUsers} from "../store.js";
import {PercentSubject} from "./types/percent/PercentSubject.js";

export const getEngagementThresholdMetStatusAndReason = async (voteCount: number, engagementThresholdSubject: PercentSubject | undefined): Promise<CriteriaResult> => {
  if(!engagementThresholdSubject) return { status: 'active', reason: 'No engagement threshold input is defined' }
  if(engagementThresholdSubject.status !== 'active') return { status: 'pending', reason: 'Engagement threshold input is pending' }
  if(engagementThresholdSubject.rejected) return { status: 'rejected', reason: 'Engagement threshold input is rejected' }
  if(engagementThresholdSubject.value === undefined) return { status: 'pending', reason: 'Engagement threshold input has no value' }
  const totalUserCount = Object.keys(await getUsers()).length
  const actualEngagementRate = (voteCount / totalUserCount) * 100
  const result = actualEngagementRate >= engagementThresholdSubject.value
  return {
    status: result ? 'active' : 'pending',
    reason: `Engagement ${Math.round(actualEngagementRate)}% is ${result ? 'above' : 'below'} threshold of ${engagementThresholdSubject.value}%`
  }
}