import {z} from "zod";
import {getSubjects} from "./store.js";

export const getInput = async <TSubject extends z.ZodObject>(subjectId: string | undefined, SubjectShema: TSubject) => {
  const subject = (await getSubjects()).find(subject => subject.id === subjectId)
  if(!subject) return
  return SubjectShema.parse(subject)
}