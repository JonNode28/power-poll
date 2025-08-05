import {input} from "@inquirer/prompts";
import {VoteFn} from "../SubjectTypeDefinition.js";
import {TextSubject} from "./TextSubject.js";
import {addValueVote} from "../addVote.js";

export const vote: VoteFn<TextSubject> = async ({ subject, userId}) => {

  const voteValue = await input({
      message: `Please enter your text vote for ${subject.name}`,
      validate: (value: string) => {
        if(!value.length) return "Please enter a value"
        return true
      }
    },
  )

  return addValueVote(subject, voteValue, userId)
}