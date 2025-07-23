import {Data} from "./Data.js";
import ora from "ora";
import fs from "fs/promises";
import subjectTypes from "./subject-types/index.js";
import {Subject} from "./Subject.js";
import {User} from "./User.js";

let data: Data

async function get() {
  if (data) return data
  const spinner = ora('Loading data...')
  spinner.start()
  const unparsedData = await tryLoadData()
  if (unparsedData) {
    data = Data.parse(unparsedData)
    spinner.succeed(`Loaded ${data.subjects.length} subjects.`)
    return data
  }
  spinner.info('First run. Initialising data')
  const percentDefinition = subjectTypes['percent']
  data = {
    subjects: [
      {
        id: 'engagement-threshold',
        name: 'Engagement Threshold',
        description: 'How much engagement is required for a vote to become active',
        type: 'percent',
        author: 'system',
        ...percentDefinition.generate(),
        inputs: {},
        status: 'pending'
      },
      {
        id: 'consensus-threshold',
        name: 'Consensus Threshold',
        description: 'How much consensus is required for a vote to become active',
        type: 'percent',
        author: 'system',
        ...percentDefinition.generate(),
        inputs: {},
        status: 'pending'
      }
    ],
    users: {}
  }
  return data
}

async function set(newData: Data) {
  await fs.writeFile('./src/data.json', JSON.stringify(Data.parse(newData), null, 2))
  data = newData
}

export async function getUsers() {
  return (await get()).users
}

export async function setUser(user: User) {
  const data = await get()
  await set({
    ...data,
    users: {
      ...data.users,
      [user.id]: user
    }
  })
}

export async function getSubjects() {
  return (await get()).subjects
}

export async function saveSubject(subject: Subject) {
  const updatedSubjects = data.subjects.filter(existingSubject => existingSubject.id !== subject.id)
  updatedSubjects.push(subject)
  const newData = {
    ...data,
    subjects: updatedSubjects
  }
  await set(newData)
  return subject
}

async function tryLoadData() {
  const dataRaw = await fs.readFile('./src/data.json')
  if (dataRaw.length === 0) return
  try {
    return JSON.parse(dataRaw.toString())
  } catch (err) {
    console.log('Had an issue loading data. It will be overwritten.')
  }
}