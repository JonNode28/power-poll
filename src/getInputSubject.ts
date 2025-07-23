import {z} from "zod";
import {getSubjects} from "./store.js";

export const getInputSubject = async <TSubject extends z.ZodObject>(subjectId: string | undefined, SubjectSchema: TSubject) => {
  const subject = (await getSubjects()).find(subject => subject.id === subjectId)
  if(!subject) return
  return SubjectSchema.parse(subject)
}