import {getInputSubject} from "../../getInputSubject.js";
import {input} from "@inquirer/prompts";
import {NumberSubject} from "./NumberSubject.js";
import {VoteFn} from "../SubjectTypeDefinition.js";
import {addValueVote, addVote} from "../addVote.js";

export const vote: VoteFn<NumberSubject> = async ({ subject, userId}) => {

  const minInput = await getInputSubject(subject.minInput, NumberSubject)
  const maxInput = await getInputSubject(subject.maxInput, NumberSubject)

  const voteValue = Number(await input({
    message: `Please enter your number vote for ${subject.name}`,
      validate: (value: string) => {
        const number= Number(value)
        if(isNaN(number)) return `"${value}" isn't a valid number`
        if(typeof minInput?.value !== 'undefined' && number < minInput.value) return `${value} is too low. Must be ${minInput} or higher`
        if(typeof maxInput?.value !== 'undefined' && number > maxInput.value) return `${value} is too high. Must be ${maxInput} or lower`
        return true
      }
    },
  ))
  return addValueVote(subject, voteValue, userId)
}