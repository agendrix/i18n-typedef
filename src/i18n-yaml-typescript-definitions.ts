import * as yaml from 'js-yaml'
import * as fs from 'fs'
import { toPascalCase, matchParams, onlyUnique } from './helpers'
import * as glob from 'glob'

export default class I18nYamlDefinitions {
  private i18nFolderPath: string
  private outputFolder: string
  constructor(i18nFolderPath: string, outputFolder: string) {
    this.i18nFolderPath = i18nFolderPath
    this.outputFolder = outputFolder
  }

  generateDefinitions() {
    try {
      let translations: Translation[] = []
      const files = glob.sync(`${this.i18nFolderPath}/**/*.{yml,yaml}`)

      if (files.length === 0) {
        throw new Error('No file found')
      }

      files.forEach(file => {
        const doc = yaml.safeLoad(fs.readFileSync(file, 'utf8'))
        translations = [...translations, ...this.getAllTranslations((Object.values(doc) as any)[0])]
      })

      const groupedTranslations = this.groupTranslations(translations)
      this.makeDefinitionFile(groupedTranslations)
    } catch (e) {
      console.log('I18n-TS definitions: ' + e.message)
    }
  }

  private makeDefinitionFile(groupTranslations: TranslationGroups) {
    const groups = Object.keys(groupTranslations)

    const fileData = `
type OptionalArgTuple<T> = T extends undefined ? [] : [T]

declare namespace I18n {
  type NumberOptions = Partial<{
    unit: string; // "$"
    precision: number; // 2
    format: string; // "%u%n"
    delimiter: string; // ","
    separator: string; // "."
    strip_insignificant_zeros: boolean; // false
  }>;

  type Translator = <Text extends keyof I18n.Translation>(
    text: Text,
    ...params: OptionalArgTuple<I18n.Translation[Text]>
  ) => string
  
${groups
  .map(group => {
    let definitionString = `  export type ${group} = {\n`

    definitionString += groupTranslations[group]
      .map(translation => {
        const paramsType =
          translation.params.length === 0 ? 'undefined' : `{ ${translation.params.join(', ')} }`

        return `    "${translation.text}": ${paramsType}`
      })
      .filter(onlyUnique)
      .join('\n')

    definitionString += '\n  }\n'
    return definitionString
  })
  .join('\n')}

  export type Translation = ${groups.join(' & ')}
}

type I18n = {
  // Note: Not all options have been defined here yet

  /** Translate the given scope with the provided options. */
  t: I18n.Translator;
  translate: I18n.Translator;

  /** Format currency with localization rules. */
  toCurrency(number: number, options?: I18n.NumberOptions);

  /** Format number using localization rules. */
  toNumber(number: number, options?: I18n.NumberOptions);

  /** Convert a number into a formatted percentage value. */
  toPercentage(number: number, options?: I18n.NumberOptions);

  /** Convert a number into a readable size representation. */
  toHumanSize(number: number, options?: I18n.NumberOptions);
};

declare var I18n: I18n
    `

    fs.writeFileSync(`${this.outputFolder}/I18n.d.ts`, fileData)
  }

  private groupTranslations(translations: Translation[]): TranslationGroups {
    const groups: TranslationGroups = {}

    translations.forEach(translation => {
      const groupName =
        toPascalCase(translation.text.substr(0, translation.text.indexOf('.'))) || 'Root'
      groups[groupName] = [...(groups[groupName] || []), translation]
    })

    return groups
  }

  private getTranslation(paths: string[], value: string): Translation {
    return {
      text: paths.join('.'),
      params: (value.match(matchParams) || []).filter(onlyUnique).map(param => `${param.slice(2, -1)}: string`)
    }
  }

  private getAllTranslations(textsObject: TextsObject, parentPaths: string[] = []): Translation[] {
    const texts = Object.keys(textsObject)
    let translations: Translation[] = []

    texts.forEach(text => {
      if (typeof textsObject[text] === 'string') {
        translations.push(this.getTranslation([...parentPaths, text], textsObject[text] as string))
      } else {
        translations = [
          ...translations,
          ...this.getAllTranslations(textsObject[text] as TextsObject, [...parentPaths, text])
        ]
      }
    })

    return translations
  }
}
