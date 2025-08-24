import {UnknownSubject} from "./Subject.js";
import {select, Separator} from "@inquirer/prompts";

export const selectInput = async (name: string, optional: boolean, compatibleInputs: UnknownSubject[]): Promise<UnknownSubject | undefined> => {
  return select({
    message: `Please select a ${name} input subject`,
    choices: [
      ...compatibleInputs.map(subject => ({
        name: subject.name,
        description: subject.description,
        value: subject
      })),
      new Separator(),
      {
        name: optional ? 'Skip' : 'Cancel',
        description: optional ? 'This input is optional' : 'Cancel input selection',
        value: undefined
      }
    ]
  })
}