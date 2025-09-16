import {Data} from "./Data.js";
import ora from "ora";
import fs from "fs/promises";
import {getSubjectType} from "./subject/types/index.js";
import {User} from "./User.js";
import {UnknownSubject} from "./subject/Subject.js";
import {z} from "zod";
import chalk from "chalk";

let data: Data
const DATA_PATH = './src/data.json'

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
    users: {}
  }
  return data
}

async function set(newData: Data) {
  const parsedData = Data.parse(newData)
  await fs.writeFile('./src/data.json', JSON.stringify(parsedData, null, 2))
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

export async function getSubjects(subjectIds?: string[]):Promise<UnknownSubject[]> {
  const subjects = (await get()).subjects
  if(!subjectIds) return subjects
  return subjects.filter(subject => subjectIds.includes(subject.id))
}

export async function getSubject<TSubject extends z.ZodType>(subjectId: string | undefined, SubjectSchema: TSubject): Promise<z.infer<TSubject>> {
  const subject = (await getSubjects()).find(subject => subject.id === subjectId)
  if(!subject) throw new Error(`Couldn't find subject ${subjectId}`)
  return SubjectSchema.parse(subject)
}

export async function saveSubject(subject: UnknownSubject, dependencyChain: string[] = []) {
  const newData = {
    ...data,
    subjects: [
      ...data.subjects.filter(existingSubject => existingSubject.id !== subject.id),
      subject
    ]
  }
  await set(newData)
  console.log(chalk.gray(`Saved subject ${[ ...dependencyChain, subject.id ].join(' => ')}`))
  return subject
}

async function tryLoadData() {
  let dataRaw
  try{
    dataRaw = await fs.readFile(DATA_PATH)
  } catch(err: any){
    if(err.code === 'ENOENT') dataRaw = await fs.writeFile(DATA_PATH, '')
    else throw err
  }
  if (!dataRaw?.length) return
  try {
    return JSON.parse(dataRaw.toString())
  } catch (err) {
    console.log('Had an issue loading data. It will be overwritten.', dataRaw)
  }
}