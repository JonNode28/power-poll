import {Data} from "./Data.js";
import ora from "ora";
import fs from "fs/promises";
import subjectTypes from "./subject-types/index.js";
import {Subject} from "./Subject.js";

let data: Data

export async function get() {
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
  data = Data.parse({
    subjects: [{
      id: 'base-pass-threshold',
      name: 'Base Pass Threshold',
      description: 'The percentage aye votes required for a pass',
      type: 'percent',
      author: 'system',
      ...percentDefinition.generator(),
      inputs: []
    }]
  })
  return data
}

export async function getSubjects() {
  return (await get()).subjects
}

export async function set(newData: Data) {
  await fs.writeFile('./src/data.json', JSON.stringify(newData, null, 2))
  data = newData
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