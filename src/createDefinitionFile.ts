import * as fs from 'fs';
import { onlyUnique } from './helpers';
import { TranslationGroups } from './types';

export default function (groupTranslations: TranslationGroups, outputFolder: string): void {
  const groups = Object.keys(groupTranslations);

  const exportGroups = groups
    .map((group) => {
      let definitionString = `  export type ${group} = {\n`;

      definitionString += groupTranslations[group]
        .map((translation) => {
          const paramsType = translation.params.length === 0 ? 'undefined' : `{ ${translation.params.join('; ')} }`;
          const output = translation.isParent ? 'any' : 'string';
          return `    "${translation.text}": [${paramsType}, ${output}];`;
        })
        .filter(onlyUnique)
        .join('\n');

      definitionString += '\n  };\n';
      return definitionString;
    })
    .join('\n');

  const fileData = `
declare namespace I18n {
${exportGroups}

  export type Translation = ${groups.join(' & ')};

  type NumberOptions = Partial<{
    unit: string; // "$"
    precision: number; // 2
    format: string; // "%u%n"
    delimiter: string; // ","
    separator: string; // "."
    strip_insignificant_zeros: boolean; // false
  }>;

  type OptionalArgTuple<P, O> = O extends string ? (P extends undefined ? [] : [P]) : any;

  type Translator = <Text extends keyof Translation>(
    text: Text,
    ...params: OptionalArgTuple<Translation[Text][0], Translation[Text][1]>
  ) => Translation[Text][1];
}

type I18n = {
  // Note: Not all options have been defined here yet
  locale: string;

  /** Translate the given scope with the provided options. */
  t: I18n.Translator;
  translate: I18n.Translator;

  /** Format currency with localization rules. */
  toCurrency(number: number, options?: I18n.NumberOptions): string;

  /** Format number using localization rules. */
  toNumber(number: number, options?: I18n.NumberOptions): string;

  /** Convert a number into a formatted percentage value. */
  toPercentage(number: number, options?: I18n.NumberOptions): string;

  /** Convert a number into a readable size representation. */
  toHumanSize(number: number, options?: I18n.NumberOptions): string;

  /** Find and process the translation using the provided scope and options. */
  lookup(scope: string): string | string[] | Record<string, unknown> | undefined;
};

declare var I18n: I18n;
    `;

  fs.writeFileSync(`${outputFolder}/I18n.d.ts`, fileData);
}
