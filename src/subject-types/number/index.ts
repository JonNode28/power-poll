import {BaseSubjectType} from "../BaseSubjectType.js";
import z from 'zod'
import {SubjectTypeDefinition} from "../SubjectTypeDefinition.js";
import {input} from "@inquirer/prompts";
import {Subject} from "../../Subject.js";
import {getInput} from "../../getInput.js";

const NumberSubjectSchema = Subject.extend({
  minInput: z.string().optional(),
  maxInput: z.string().optional(),
  value: z.number(),
  votes: z.record(z.string(), z.looseObject({
    timestamp: z.iso.datetime(),
    value: z.number()
  }))
})

export const NumberDefinition: SubjectTypeDefinition = {
  id: 'number',
  name: 'Number',
  description: 'Establishes consensus around a number',
  schema: NumberSubjectSchema,
  inputs: [
    { id: 'max', type: 'number', optional: true },
    { id: 'min', type: 'number', optional: true },
    { id: 'participation', type: 'percent' }
  ],
  generator: () => ({

  }),
  voter: async ({ subject, userId}) => {
    const numberSubject = NumberSubjectSchema.parse(subject)

    const minInput = await getInput(numberSubject.minInput, NumberSubjectSchema)
    const maxInput = await getInput(numberSubject.maxInput, NumberSubjectSchema)

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

    const allVotes = Object.values(numberSubject.votes)
    const newTotal = allVotes.reduce((runningTotal, vote) =>
      runningTotal + vote.value,
      voteValue)

    const newAverageValue = Math.floor(newTotal / allVotes.length)

    return ({
      ...numberSubject,
      votes: {
        ...numberSubject.votes,
        [userId]: {
          timestamp: new Date().toISOString(),
          value: voteValue
        }
      },
      value: newAverageValue
    })
  },

}