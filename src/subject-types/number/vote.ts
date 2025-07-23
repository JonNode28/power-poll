import {getTypedInput} from "../../getTypedInput.js";
import {input} from "@inquirer/prompts";
import {NumberSubject} from "./NumberSubject.js";
import {VoteFn} from "../SubjectTypeDefinition.js";

export const vote: VoteFn = async ({ subject, userId}) => {
  const numberSubject = NumberSubject.parse(subject)

  const minInput = await getTypedInput(numberSubject.minInput, NumberSubject)
  const maxInput = await getTypedInput(numberSubject.maxInput, NumberSubject)

  const voteValue = Number(await input({
      message: 'What value would you like to vote for?',
      validate: (value: string) => {
        const number= Number(value)
        if(isNaN(number)) return `"${value}" isn't a valid number`
        if(typeof minInput !== 'undefined' && number < minInput.value) return `${value} is too low. Must be ${minInput} or higher`
        if(typeof maxInput !== 'undefined' && number > maxInput.value) return `${value} is too high. Must be ${maxInput} or lower`
        return true
      }
    },
  ))

  const newVotes = {
    ...numberSubject.votes,
    [userId]: {
      timestamp: new Date().toISOString(),
      value: voteValue
    }
  }

  const allVotes = Object.values(newVotes)
  const newTotal = allVotes.reduce((runningTotal, vote) =>
      runningTotal + vote.value,
    0)

  const newAverageValue = newTotal ? Math.round(newTotal / allVotes.length) : 0

  return {
    ...numberSubject,
    votes: newVotes,
    value: newAverageValue
  }
}