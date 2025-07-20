import { input } from '@inquirer/prompts';
import { select, Separator } from '@inquirer/prompts';
import fs from 'fs/promises'
import ora from 'ora';
import {Data} from "./Data.js";
import {createNewSubject} from "./createNewSubject.js";
import {Subject} from "./Subject.js";
import subjectTypes from "./subject-types/index.js";
import {getSubjects, saveSubject} from "./store.js";

console.log('Welcome to ✨Power Poll ✨')

const userId = await input({ message: 'ID yourself! ⚔️' });
console.clear()
console.log(`Welcome ${userId}`)


await home()

async function home(){
  let action = await select({
    message: 'What would you like to do',
    choices: [
      {
        name: 'List Subjects',
        value: async () => await list()
      },
      {
        name: 'Create Subject',
        value: async () => {
          const subject = await createNewSubject(userId)
          if(subject) await saveSubject(subject)
        }
      },
      {
        name: 'exit',
        value: () => process.exit(0)
      }
    ]
  })
  await action()
}

async function list(){
  console.clear()
  let subject: Subject | undefined = await select({
    message: 'Select a subject',
    choices: [
      ...(await getSubjects()).map(subject => ({
        name: subject.name,
        value: subject,
      })),
      new Separator(),
      {
        name: 'Start new subject',
        value: undefined,
      },
    ],
  });

  if(!subject){
    subject = await create();
  }

  await detail(subject)
}

async function detail(subject: Subject){
  console.clear()
  console.log(`Subject: ${subject.name}`)
  console.log(`Type: ${subject.type}`)
  console.log('Inputs:')
  if(subject.inputs?.length) console.table(subject.inputs)
  else console.log('This subject has no inputs')
  console.log(subject.description)
  console.log()
  const action = await select({
    message: 'What would you like to do?',
    choices: [
      {
        name: 'Vote',
        value: async () => vote(subject, userId)
      },
      new Separator(),
      {
        name: 'back',
        value: async () => list(),
      },
      {
        name: 'exit',
        value: () => process.exit(0)
      }
    ],
  });
  await action()
}

async function create(){
  console.clear()
  const subject = await createNewSubject(userId)
  if(!subject) process.exit(0)
  await saveSubject(subject)
  console.log(`Now that you've created a new subject, let's vote on it!`)
  return subject
}

async function vote(subject: Subject, userId: string){
  console.clear()
  console.log(`Vote on ${subject.name}`)
  console.log(subject.description)
  const subjectType = subjectTypes[subject.type]
  if(!subjectType) throw new Error(`Couldn't find a "${subject.type}" definition`)
  const updatedSubject = await subjectType.voter({
    subject,
    userId
  })

  await saveSubject(updatedSubject)
  await home()
}


export {}