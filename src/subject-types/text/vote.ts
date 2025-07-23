import {input} from "@inquirer/prompts";
import {VoteFn} from "../SubjectTypeDefinition.js";
import {TextSubject} from "./TextSubject.js";

export const vote: VoteFn<typeof TextSubject> = async ({ subject, userId}) => {

  const voteValue = await input({
      message: `Please enter your text vote for ${subject.name}`,
      validate: (value: string) => {
        if(!value.length) return "Please enter a value"
        return true
      }
    },
  )

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