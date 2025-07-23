import {SubjectTypeDefinition} from "../SubjectTypeDefinition.js";
import {PercentSubject} from "./PercentSubject.js";
import {vote} from "./vote.js";



export const PercentDefinition: SubjectTypeDefinition<typeof PercentSubject> = {
  id: 'percent',
  name: 'Percent',
  description: 'Establishes consensus around a percentage (0-100)',
  schema: PercentSubject,
  inputs: [],
  generate: () => ({
    value: 50,
    votes: {}
  }),
  vote,
  update: async (subject, updatedSubjects) => {
    const percentSubject = PercentSubject.parse(subject)
    const allVotes = Object.values(percentSubject.votes)
    const newTotal = allVotes.reduce((runningTotal, vote) =>
        runningTotal + vote.value,
      0)

    const newAverageValue = newTotal ? Math.round(newTotal / allVotes.length) : 0
    return {
      ...subject,
      value: newAverageValue,
      status: allVotes.length > 0 ? 'active' : 'pending'
    }
  }
}