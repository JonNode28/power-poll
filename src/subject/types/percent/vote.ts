import {input} from "@inquirer/prompts";
import {PercentSubject} from "./PercentSubject.js";
import {VoteFn} from "../SubjectTypeDefinition.js";
import {addValueVote} from "../addVote.js";
import {ZodType} from "zod";

export const vote: VoteFn<PercentSubject, ZodType<number>, ZodType<string>> = async ({ subject, userId }) => {
  const voteValue = Number(await input({
    message: `Please enter your percent vote for ${subject.name}`,
      validate: (value: string) => {
        const number = Number(value)
        if (isNaN(number)) return `"${value}" isn't a valid number`
        if (number < 0) return `${value} is too low. Must be 0 or higher`
        if (number > 100) return `${value} is too high. Must be 100 or lower`
        return true
      }
    },
  ))

  console.log(`Your vote has been counted.`)

  return addValueVote(subject, voteValue, userId)
}