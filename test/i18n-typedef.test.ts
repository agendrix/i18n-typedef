import I18nYamlDefinitions from '../src/I18nYamlDefinitions'
import * as fs from 'fs'
import { rm } from 'shelljs'

const expectedOutputPath = __dirname + '/I18n.d.ts'

/**
 * I18nYamlDefinitions test
 */
describe('I18nYamlDefinitions test', () => {
  it('I18nYamlDefinitions is instantiable', () => {
    expect(new I18nYamlDefinitions([], '')).toBeInstanceOf(I18nYamlDefinitions)
  })

  it('I18nYamlDefinitions is does not crash when there is no I18n files', () => {
    new I18nYamlDefinitions([`${__dirname}/no-locales`], __dirname).generateDefinitions()

    expect(fs.existsSync(expectedOutputPath)).toBeFalsy()
  })

  it('I18nYamlDefinitions generates definitions file', () => {
    const expectedTranslations = [
      `"text_on_root": undefined;`,
      `"root_translation": undefined;`,
      `"simple.ok": undefined;`,
      `"simple._yes": undefined;`,
      `"simple._no": undefined;`,
      `"simple.other": undefined;`,
      `"nested_children.first_child.level_two": undefined;`,
      `"nested_children.first_child.nested.level_three": undefined;`,
      `"nested_children.second_child.object_one": undefined;`,
      `"nested_children.second_child.object_two": undefined;`,
      `"arguments.withTime": { time: string };`,
      `"arguments.multiple.withIdAndDate": { id: string; date: string };`,
      `"arguments.multiple.withNameTimeAndDate": { name: string; time: string; date: string };`,
      `"arguments.multiple.withNumbersInName": { brand_4_first_digits: string; last4: string };`,
      `"arguments.none": undefined;`,
      `"other.title": undefined;`,
      `"other.text": undefined;`
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
