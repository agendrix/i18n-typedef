import * as yaml from 'js-yaml'
import * as fs from 'fs'
import { toPascalCase, matchParams, onlyUnique } from './helpers'
import * as globby from 'globby'
import createDefinitionFile from './createDefinitionFile'
import { Translation, TranslationGroups, TextsObject } from './types'

export default class I18nYamlDefinitions {
  private i18nFolders: string[]
  private outputFolder: string

  constructor(i18nFolders: string[], outputFolder: string) {
    this.i18nFolders = i18nFolders
    this.outputFolder = outputFolder
  }

  generateDefinitions() {
    try {
      let translations: Translation[] = []
      const files = globby.sync(this.i18nFolders.map(folder => `${folder}/**/*.{yml,yaml}`))

      if (files.length === 0) {
        throw new Error('[i18n-typedef] No file found')
      }

      files.forEach(file => {
        const doc = yaml.safeLoad(fs.readFileSync(file, 'utf8'))
        translations = [...translations, ...this.getAllTranslations((Object.values(doc) as any)[0])]
      })

      const groupedTranslations = this.groupTranslations(translations)
      createDefinitionFile(groupedTranslations, this.outputFolder)

      console.log('[i18n-typedef] Definitions generated.')
    } catch (e) {
      console.log('[i18n-typedef] Error:\n' + e.message)
    }
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
      params: (value.match(matchParams) || [])
        .filter(onlyUnique)
        .map(param => `${param.slice(2, -1)}: string`)
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
