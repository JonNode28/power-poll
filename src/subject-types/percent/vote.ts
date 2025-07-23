import {input} from "@inquirer/prompts";
import {PercentSubject} from "./PercentSubject.js";
import {VoteFn} from "../SubjectTypeDefinition.js";

export const vote: VoteFn = async ({ subject, userId }) => {
  const percentSubject = PercentSubject.parse(subject)
  const voteValue = Number(await input({
      message: 'What percent would you like to vote for?',
      validate: (value: string) => {
        const number = Number(value)
        if (isNaN(number)) return `"${value}" isn't a valid number`
        if (number < 0) return `${value} is too low. Must be 0 or higher`
        if (number > 100) return `${value} is too high. Must be 100 or lower`
        return true
      }
    },
  ))

  const newVotes = {
    ...percentSubject.votes,
    [userId]: {
      timestamp: new Date().toISOString(),
      value: voteValue
    }
  }

  const allVotes = Object.values(newVotes)

  const newTotal = allVotes.reduce((runningTotal, vote) =>
      runningTotal + vote.value,
    0)

  const newAverageValue = Math.round(newTotal / allVotes.length)

  console.log(`Your vote has been counted. The new overall value for this subject is now ${newAverageValue}`)

  return ({
    ...percentSubject,
    votes: newVotes,
    value: newAverageValue
  })
}