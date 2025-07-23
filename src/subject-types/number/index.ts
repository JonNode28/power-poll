import {SubjectTypeDefinition} from "../SubjectTypeDefinition.js";
import {vote} from "./vote.js";
import {NumberSubject} from "./NumberSubject.js";
import {getUsers} from "../../store.js";
import {PercentSubject} from "../percent/PercentSubject.js";
import {getUpdatedInputSubject} from "../../getUpdatedInputSubject.js";



export const NumberDefinition: SubjectTypeDefinition<typeof NumberSubject> = {
  id: 'number',
  name: 'Number',
  description: 'Establishes consensus around a number',
  schema: NumberSubject,
  inputs: [
    { id: 'min', type: 'number', optional: true },
    { id: 'max', type: 'number', optional: true },
    { id: 'engagement', type: 'percent' }
  ],
  generate: () => ({
    value: 0,
    votes: {}
  }),
  vote,
  update: async (subject, updatedSubjects) => {
    const minValue = (await getUpdatedInputSubject(subject.inputs?.min, NumberSubject, updatedSubjects))?.value
    const maxValue = (await getUpdatedInputSubject(subject.inputs?.max, NumberSubject, updatedSubjects))?.value
    const engagementThreshold = (await getUpdatedInputSubject(subject.inputs?.engagement, PercentSubject, updatedSubjects))?.value

    const allVotes = Object.values(subject.votes)
    const newTotal = allVotes.reduce((runningTotal, vote) => {
      if(withinRange(vote.value, minValue, maxValue)) runningTotal += vote.value
      return runningTotal
    },0)

    const newAverageValue = newTotal ? Math.round(newTotal / allVotes.length) : 0

    const totalUserCount = Object.keys(await getUsers()).length
    const actualEngagementRate = allVotes.length / totalUserCount

    return {
      ...subject,
      value: newAverageValue,
      status: engagementThreshold && (actualEngagementRate * 100) > engagementThreshold ? 'active' : 'pending'
    }
  }
}

function withinRange(value: number, min: number | undefined, max: number | undefined){
  return (typeof min === 'undefined' || value >= min) &&
    (typeof max === 'undefined' || value >= max)
}