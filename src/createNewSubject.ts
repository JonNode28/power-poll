import {input, select} from "@inquirer/prompts";
import {getAllSubjectTypes, getSubjectType} from "./subject/types/index.js";
import {getSubjects, saveSubject} from "./store.js";
import {Separator} from "@inquirer/prompts";
import {UnknownSubject} from "./subject/Subject.js";

const getExistingSubject = async (id: string) => (await getSubjects()).find(subject => subject.id === id)

export const createNewSubject = async (userId: string, type?: string): Promise<UnknownSubject | undefined> => {
  const selectedType = type
    ? {
      type,
      subjectType: getSubjectType(type)
    }
    : await select({
      message: 'What type of subject would you like to create?',
      choices: [
        ...Object.entries(getAllSubjectTypes()).map(([type, subjectType]) => ({
          name: subjectType.name,
          value: {
            type,
            subjectType
          }
        })),
        new Separator(),
        {
          name: 'Cancel',
          value: null
        }
      ]
    })
  if(!selectedType){
    return
  }
  if (!selectedType.subjectType) {
    console.log(`Couldn't find a definition for "${type}" subject type`)
    return
  }
  const selectedName = await input({
    message: 'What would you like to call the new subject?',
    validate: (string) => {
      if (string.length < 2) return 'Must be at least two characters long'
      return true
    }
  })
  const selectedDescription = await input({
    message: 'Describe the new subject'
  })

  let idGuess = ''
  let idGuessCount = 0
  while (!idGuess || await getExistingSubject(idGuess) && idGuessCount < 10) {
    idGuess = selectedName.toLowerCase()
      .replace(/[^A-Za-z0-1]/g, '-')
      .replace(/-{2,}/g, '-')
    if (idGuessCount > 0) idGuess += `-${idGuessCount}`
    idGuessCount++
  }
  const selectedId = await input({
    message: 'What ID would you like to give it?',
    default: idGuess,
    prefill: 'editable',
    validate: async (id) => {
      const existingSubject = await getExistingSubject(id)
      if (existingSubject) return `"${id}" is already taken by another subject with description: ${existingSubject.description}`
      return true
    }
  })

  const newSubject = await selectedType.subjectType.createSubject({
    id: selectedId,
    name: selectedName,
    description: selectedDescription,
    type: selectedType.type,
    author: userId,
    votes: {},
    status: 'pending',
    statusReason: [{status: 'pending', reason: 'Newly created'}],
  })

  if (!newSubject) {
    console.log('Could not created subject')
    return
  }

  await saveSubject(newSubject)
  console.log('Subject created')

  return newSubject
}