import {BaseSubjectType} from "../BaseSubjectType.js";
import z from 'zod'
import {SubjectTypeDefinition} from "../SubjectTypeDefinition.js";
import {input} from "@inquirer/prompts";
import {Subject} from "../../Subject.js";

const PercentSubjectSchema = Subject.extend({
  value: z.number(),
  votes: z.record(z.string(), z.looseObject({
    timestamp: z.iso.datetime(),
    value: z.number()
  }))
})

export const PercentDefinition: SubjectTypeDefinition = {
  id: 'percent',
  name: 'Percent',
  description: 'Establishes consensus around a percentage (0-100)',
  schema: PercentSubjectSchema,
  inputs: [],
  generator: () => ({
    value: 50,
    votes: {}
  }),
  voter: async ({subject, userId}) => {
    const percentSubject = PercentSubjectSchema.parse(subject)
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

    const newAverageValue = Math.floor(newTotal / allVotes.length)

    console.log(`Your vote has been counted. The new overall value for this subject is now ${newAverageValue}`)

    return ({
      ...percentSubject,
      votes: newVotes,
      value: newAverageValue
    })
  }
}