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

export async function save() {
  await fs.writeFile('./src/data.json', JSON.stringify(data, null, 2))
  console.log('Saved.')
}

export async function getUsers() {
  return (await get()).users
}

export async function setUser(user: User) {
  const loadedData = await get()
  data = {
    ...loadedData,
    users: {
      ...loadedData.users,
      [user.id]: user
    }
  }
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

export async function setSubject(subject: UnknownSubject, dependencyChain: string[] = []) {
  const loadedData = await get()
  data = {
    ...loadedData,
    subjects: [
      ...loadedData.subjects.filter(existingSubject => existingSubject.id !== subject.id),
      subject
    ]
  }
  console.log(chalk.gray(`Set subject ${[ ...dependencyChain, subject.id ].join(' => ')}`))
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
  return JSON.parse(dataRaw.toString())
}