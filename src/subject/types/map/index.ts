import {SubjectTypeDefinition} from "../SubjectTypeDefinition.js";
import {vote} from "./vote.js";
import {MapSubject, MapSubjectValue, MapSubjectValueReason} from "./MapSubject.js";
import {update} from "./update.js";
import {generateBaseSubject} from "../generateBaseSubject.js";
import {getSubjects} from "../../../store.js";
import {selectInput} from "../../selectInput.js";
import {StructureSubject} from "../structure/StructureSubject.js";
import {MapSubjectStructure} from "./MapSubjectStructure.js";
import {confirm, input, number, select, Separator} from '@inquirer/prompts';
import {UnknownSubjectStructure} from "../../SubjectStructure.js";

export const MapDefinition: SubjectTypeDefinition<MapSubject, typeof MapSubjectValue, typeof MapSubjectValueReason> = {
  id: 'map',
  name: 'Map',
  description: 'Establishes consensus around a map of subjects',
  subjectSchema: MapSubject,
  createSubject: async (setup) => {
    const newSubject = generateBaseSubject({type: 'map', setup})

    const allSubjects = await getSubjects()
    const percentSubjects = allSubjects.filter(subject => subject.type === 'percent')

    const engagement = await selectInput('Engagement', false, percentSubjects)
    if (!engagement) return

    const consensus = await selectInput('Consensus', false, percentSubjects)
    if (!consensus) return

    const mapSubjectStructures = allSubjects.filter(subject =>
      subject.type === 'structure' && StructureSubject.parse(subject).structure?.type === 'list')
    const structure = await selectInput('Structure', true, mapSubjectStructures)

    return {
      ...newSubject,
      valueReason: [ 'Newly created' ],
      engagementInput: engagement.id,
      consensusInput: consensus.id,
      structureInput: structure?.id
    }
  },
  createStructure: async () => {
    const mapStructure: MapSubjectStructure = {type: 'map'}
    if (await confirm({ message: 'Apply structure to the map?' })) {

      const availableStructureChoices =
        [
          ...(await getSubjects())
            .filter((subject): subject is StructureSubject =>
              subject.type === 'structure'
              && subject.value)
            .map(subject => ({
              name: subject.name,
              value: subject.structure!
            })),
          new Separator(),
          {
            name: 'Done',
            value: null
          }
        ]
      do {
        if (!mapStructure.properties) mapStructure.properties = {}
        console.clear()
        console.table(Object.entries(mapStructure.properties).map(([key, structure]) => ({key, type: structure.type})))
        const newKey = await input({
          message: 'Enter the property name'
        })
        const selectedStructure = await select({
          message: `select the structure to use for ${newKey}`,
          choices: availableStructureChoices
        })
        if(!selectedStructure) break
        mapStructure.properties[newKey] = selectedStructure
      } while (true)
    }

    return mapStructure
  },
  getInputs: (subject: MapSubject) => ([
    {
      name: 'Engagement',
      description: 'The subject used to determine the engagement threshold',
      subjectId: subject.engagementInput,
      optional: false
    },
    {
      name: 'Consensus',
      description: 'The subject used to determine the consensus threshold',
      subjectId: subject.consensusInput,
      optional: false
    },
    {
      name: 'Structure',
      description: 'The subject used to determine the structure threshold',
      subjectId: subject.structureInput,
      optional: true
    },
  ]),
  vote,
  update
}
