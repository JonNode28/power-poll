import {ZodObject} from "zod";
import {Subject} from "../Subject.js";

export interface SubjectVoterProps {
  subject: Subject,
  userId: string
}

export interface SubjectTypeDefinition {
  id: string
  name: string
  description: string
  schema: ZodObject
  inputs: { id: string, type: string, optional?: boolean }[]
  generator: () => object
  voter: ({ subject, userId }: SubjectVoterProps) => Promise<Subject> | Subject
}