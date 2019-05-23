import * as fs from 'fs'
import { onlyUnique } from './helpers'
import { TranslationGroups } from './types'

export default function(groupTranslations: TranslationGroups, outputFolder: string) {
  const groups = Object.keys(groupTranslations)

  const fileData = `
type OptionalArgTuple<T> = T extends undefined ? [] : [T]

declare namespace I18n {
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

  fs.writeFileSync(`${outputFolder}/I18n.d.ts`, fileData)
}
