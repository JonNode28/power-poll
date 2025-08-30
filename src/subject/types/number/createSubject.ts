import {CreateSubjectFn} from "../SubjectTypeDefinition.js";
import {NumberSubject, NumberSubjectValue, NumberSubjectValueReason} from "./NumberSubject.js";
import {getSubjects} from "../../../store.js";
import {selectInput} from "../../selectInput.js";
import {generateBaseSubject} from "../generateBaseSubject.js";

export const createSubject: CreateSubjectFn<NumberSubject, typeof NumberSubjectValue, typeof NumberSubjectValueReason> = async (setup) => {
  const allSubjects = await getSubjects()
  const numberSubjects = allSubjects.filter(subject => subject.type === 'number')

  const min = await selectInput('Min', true, numberSubjects)
  const max = await selectInput('Max', true, numberSubjects)
  const engagement = await selectInput('engagement', true, allSubjects.filter(subject => subject.type === 'percent'))

  return {
    ...generateBaseSubject({ type: 'number', setup }),
    valueReason: 'Newly created',
    minInput: min?.id,
    maxInput: max?.id,
    engagementInput: engagement?.id
  }
}