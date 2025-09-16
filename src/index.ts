import { input } from '@inquirer/prompts';
import { select, Separator } from '@inquirer/prompts';
import {createNewSubject} from "./createNewSubject.js";
import {getSubjectType, getSubjectTypeBySubject} from "./subject/types/index.js";
import {getSubjects, getUsers, save, setSubject, setUser} from "./store.js";
import {getUpdatedSubjects} from "./subject/utility/getUpdatedSubjects.js";
import {RejectedVote, UnknownSubject} from "./subject/Subject.js";

console.log('Welcome to ✨Power Poll ✨')

console.clear()

const TABLE_HEADERS = [ 'name', 'type', 'value', 'status' ]

const userId = await auth()

await home()

async function auth(){
  const userId = await input({ message: 'ID yourself! ⚔️' });
  const users = await getUsers()
  const existingUser = users[userId]
  if(existingUser) console.log(`Welcome back ${userId}`)
  else{
    await setUser({
      id: userId
    })
    console.log(`Welcome ${userId}!`)
  }
  return userId
}

async function home(){
  let action = await select({
    message: 'What would you like to do?',
    choices: [
      {
        name: 'Vote',
        value: async () => list()
      },
      {
        name: 'Create Subject',
        value: async () => {
          const subject = await createNewSubject(userId)
          if(subject) await setSubject(subject)
          await home()
        }
      },
      {
        name: 'Update Values',
        value: async () => update()
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
  let result = await select({
    message: 'Select a subject',
    choices: [
      ...(await getSubjects()).map(subject => ({
        name: subject.name,
        value: async () => detail(subject),
      })),
      new Separator(),
      {
        name: 'Back',
        value: async () => home(),
      },
      {
        name: 'Exit',
        value: async () => process.exit(0)
      }
    ],
  });

  await result()
}

async function update(){
  const updatedSubjects = await getUpdatedSubjects()
  console.table(updatedSubjects.map(updatedSubject => ({
    ...updatedSubject,
    statusReason: updatedSubject.statusReason.map(statusReason => `${statusReason.status} - ${statusReason.reason}`)
  })), TABLE_HEADERS)
  await save()
  await home()
}

async function detail(subject: UnknownSubject){
  console.clear()
  console.log(`Subject: ${subject.name}`)
  console.log(`Type: ${subject.type}`)
  console.log('Inputs:')
  const subjectType = getSubjectTypeBySubject(subject)
  if(subjectType.getInputs){
    const inputs = subjectType.getInputs(subject)
    if(inputs?.length) console.table(inputs)
    else console.log('This subject has no inputs')
  } else console.log(`Subject of type "${subject.type}" doesn't have inputs`)
  console.log(subject.description)
  console.log()
  const action = await select({
    message: 'What would you like to do?',
    choices: [
      {
        name: 'Vote',
        value: async () => vote(subject, userId)
      },
      {
        name: 'Reject',
        value: async () => reject(subject, userId)
      },
      new Separator(),
      {
        name: 'Back',
        value: async () => list(),
      },
      {
        name: 'Exit',
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
  await setSubject(subject)
  console.log(`Now that you've created a new subject, let's vote on it!`)
  return subject
}

async function vote(subject: UnknownSubject, userId: string){
  console.clear()
  console.log(`Vote on ${subject.name}`)
  console.log(subject.description)
  const subjectType = getSubjectType(subject.type)
  if(!subjectType) throw new Error(`Couldn't find a "${subject.type}" definition`)
  const updatedSubject = await subjectType.vote({
    subject,
    userId
  })

  await setSubject(updatedSubject)
  console.log(`Finished voting on ${subject.name}`)
  await home()
}

async function reject(subject: UnknownSubject, userId: string){
  console.clear()
  const rejectionVote:RejectedVote = {
    timestamp: new Date().toISOString(),
    rejected: true
  }
  const updatedSubject:UnknownSubject = {
    ...subject,
    votes: {
      ...subject.votes,
      [userId]: rejectionVote
    },
    voteArchive: [
      ...subject.voteArchive,
      {
        userId,
        vote: rejectionVote
      }
    ]
  }

  await setSubject(updatedSubject)
  console.log(`Rejected ${subject.name}`)
  await home()
}


export {}