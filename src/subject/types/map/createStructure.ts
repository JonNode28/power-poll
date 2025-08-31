import {CreateSubjectStructureFn} from "../SubjectTypeDefinition.js";
import {MapSubjectStructure} from "./MapSubjectStructure.js";
import {confirm, input, select, Separator} from "@inquirer/prompts";
import {getSubjects} from "../../../store.js";
import {StructureSubject} from "../structure/StructureSubject.js";

export const createStructure: CreateSubjectStructureFn = async () => {
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
}