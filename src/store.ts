import {Data} from "./Data.js";
import ora from "ora";
import fs from "fs/promises";
import {getSubjectType} from "./subject/types/index.js";
import {User} from "./User.js";
import {UnknownSubject} from "./subject/Subject.js";

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
  const percentDefinition = getSubjectType('percent')
  const engagementThreshold = await percentDefinition.createSubject({
    id: 'engagement-threshold',
    name: 'Engagement Threshold',
    description: 'How much engagement is required for a vote to become active',
    author: 'system',
    status: 'pending',
    statusReason: [{ status: 'pending', reason: 'Newly created' }]
  })
  if(!engagementThreshold) throw new Error(`An engagement threshold subject is required`)
  const consensusThreshold = await percentDefinition.createSubject({
    id: 'consensus-threshold',
    name: 'Consensus Threshold',
    description: 'How much consensus is required for a vote to become active',
    author: 'system',
    status: 'pending',
    statusReason: [{ status: 'pending', reason: 'Newly created' }]
  })
  if(!consensusThreshold) throw new Error(`A consensus threshold subject is required`)
  data = {
    subjects: [ engagementThreshold, consensusThreshold ],
    voteConstraints: [],
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

export async function getSubjects():Promise<UnknownSubject[]> {
  return (await get()).subjects
}

export async function saveSubject(subject: UnknownSubject) {
  const newData = {
    ...data,
    subjects: [
      ...data.subjects.filter(existingSubject => existingSubject.id !== subject.id),
      subject
    ]
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