import I18nYamlDefinitions from '../src/I18nYamlDefinitions'
import * as fs from 'fs'
import { rm } from 'shelljs'

/**
 * I18nYamlDefinitions test
 */
describe('I18nYamlDefinitions test', () => {
  it('works if true is truthy', () => {
    expect(true).toBeTruthy()
  })

  it('I18nYamlDefinitions is instantiable', () => {
    expect(new I18nYamlDefinitions([], '')).toBeInstanceOf(I18nYamlDefinitions)
  })

  it('I18nYamlDefinitions generates definitions file', () => {
    const expectedOutputPath = __dirname + '/I18n.d.ts'
    const expectedTranslations = [
      `"text_on_root": undefined`,
      `"root_translation": undefined`,
      `"simple.ok": undefined`,
      `"simple._yes": undefined`,
      `"simple._no": undefined`,
      `"simple.other": undefined`,
      `"nested_children.first_child.level_two": undefined`,
      `"nested_children.first_child.nested.level_three": undefined`,
      `"nested_children.second_child.object_one": undefined`,
      `"nested_children.second_child.object_two": undefined`,
      `"arguments.withTime": { time: string }`,
      `"arguments.multiple.withIdAndDate": { id: string, date: string }`,
      `"arguments.multiple.withNameTimeAndDate": { name: string, time: string, date: string }`,
      `"arguments.none": undefined`,
      `"other.title": undefined`,
      `"other.text": undefined`
    ]
    const i18nDefinitionCreator = new I18nYamlDefinitions(
      [`${__dirname}/locales/en`, `${__dirname}/locales/en-CA`],
      __dirname
    )

    i18nDefinitionCreator.generateDefinitions()

    const file = fs.readFileSync(expectedOutputPath, 'utf8')
    expect(file).not.toBeNull()
    expect(file).toContain('type I18n')
    expectedTranslations.forEach(translation => expect(file).toContain(translation))
    expect(file).toContain(
      'export type Translation = Simple & Other & Root & NestedChildren & Arguments'
    )

    rm(expectedOutputPath)
  })
})
