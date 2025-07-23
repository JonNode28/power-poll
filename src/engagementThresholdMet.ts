import {PercentSubject} from "./subject-types/percent/PercentSubject.js";
import {getUsers} from "./store.js";

export const engagementThresholdMet = async (voteCount: number, engagementThresholdSubject: PercentSubject | undefined) => {
  if(!engagementThresholdSubject) return true
  if(engagementThresholdSubject.status !== 'active') return false
  const totalUserCount = Object.keys(await getUsers()).length
  const actualEngagementRate = voteCount / totalUserCount
  return (actualEngagementRate * 100) > engagementThresholdSubject.value
}