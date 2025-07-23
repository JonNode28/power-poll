import {getInputSubject} from "../../getInputSubject.js";
import {input} from "@inquirer/prompts";
import {NumberSubject} from "./NumberSubject.js";
import {VoteFn} from "../SubjectTypeDefinition.js";

export const vote: VoteFn<typeof NumberSubject> = async ({ subject, userId}) => {

  const minInput = await getInputSubject(subject.minInput, NumberSubject)
  const maxInput = await getInputSubject(subject.maxInput, NumberSubject)

  const voteValue = Number(await input({
    message: `Please enter your number vote for ${subject.name}`,
      validate: (value: string) => {
        const number= Number(value)
        if(isNaN(number)) return `"${value}" isn't a valid number`
        if(typeof minInput !== 'undefined' && number < minInput.value) return `${value} is too low. Must be ${minInput} or higher`
        if(typeof maxInput !== 'undefined' && number > maxInput.value) return `${value} is too high. Must be ${maxInput} or lower`
        return true
      }
    },
  ))

  return {
    ...subject,
    votes: {
      ...subject.votes,
      [userId]: {
        timestamp: new Date().toISOString(),
        value: voteValue
      }
    },
  }
}