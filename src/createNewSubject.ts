import {input, select} from "@inquirer/prompts";
import {Subject} from "./Subject.js";
import subjectTypes from "./subject-types/index.js";
import {getSubjects, saveSubject} from "./store.js";
import {Separator} from "@inquirer/prompts";

const getExistingSubject = async (id: string) => (await getSubjects()).find(subject => subject.id === id)

export const createNewSubject = async (userId: string, type?: string): Promise<Subject | undefined> => {
  const selectedType = type
    ? {
      type,
      subjectType: subjectTypes[type]
    }
    : await select({
      message: 'What type of subject would you like to create?',
      choices: Object.entries(subjectTypes).map(([type, subjectType]) => ({
        name: subjectType.name,
        value: {
          type,
          subjectType
        }
      }))
    })
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

  const newSubject: Subject = {
    id: selectedId,
    name: selectedName,
    description: selectedDescription,
    type: selectedType.type,
    author: userId,
    votes: {},
    inputs: {},
    status: 'pending',
    ...selectedType.subjectType.generate ? selectedType.subjectType.generate() : {}
  }

  if (!selectedType.subjectType.inputs?.length) return await saveSubject(newSubject)
  console.log(`This subject type has ${selectedType.subjectType.inputs.length}:`)
  console.table(selectedType.subjectType.inputs)
  for (const inputDefinition of selectedType.subjectType.inputs) {
    const compatibleInputs = (await getSubjects()).filter(subject => subject.type === inputDefinition.type)
    //
    // if (!compatibleInputs.length) {
    //   console.log(`There are no compatible "${inputDefinition.type}" subjects for the "${inputDefinition.id}". Please create one first.`)
    //   const newInput = await createNewSubject(userId, inputDefinition.type)
    //   if (!newInput) {
    //     console.log(`Couldn't create the new input`)
    //     return
    //   }
    //   await saveSubject(newInput)
    // }
    //
    if (!compatibleInputs.length) {
      if(inputDefinition.optional){
        console.log(`Couldn't find a "${inputDefinition.type}" subject for the "${inputDefinition.id}" input. Skipping as it's optional anyway...`)
        continue
      } else {
        console.log(`Couldn't find a "${inputDefinition.type}" subject for the "${inputDefinition.id}" input. This input is not optional so you'll need to create one first.`)
        return
      }
    }

    const selectedAction = await select({
      message: `Please select a ${inputDefinition.id} input subject`,
      choices: [
        ...compatibleInputs.map(subject => ({
          name: subject.name,
          description: subject.description,
          value: () =>{
            if(!newSubject.inputs) newSubject.inputs = {}
            newSubject.inputs[inputDefinition.id] = subject.id
          },
        })),
        new Separator(),
        ...inputDefinition.optional
          ? [{
            name: 'Skip',
            description: 'This input is optional',
            value: () => console.log('Skipping...')
          }]
          : []
      ]
    })
    selectedAction()
  }

  await saveSubject(newSubject)
  console.log('Subject created')

  return newSubject
}