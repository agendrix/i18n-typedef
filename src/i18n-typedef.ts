import * as program from 'commander';
import * as fs from 'fs';
import * as colors from 'colors';
import * as debounce from 'lodash.debounce';
import I18nYamlDefinitions from './I18nYamlDefinitions';
import { toTitleCase } from './helpers';

program
  .command('watch <directories...>')
  .option('-o, --output <directory>', 'Directory where to put the generated definition')
  .action(function (directories: string[], cmd: { output: string }) {
    const i18nYamlDefinitions = new I18nYamlDefinitions(directories, cmd.output);

    const listener = (event: string, filename: string) => {
      console.log(`[i18n-typedef] ${toTitleCase(event)} ${filename}`);
      i18nYamlDefinitions.generateDefinitions();
    };

    directories.forEach((dir) => fs.watch(dir, { recursive: true }, debounce(listener, 250)));

    i18nYamlDefinitions.generateDefinitions();
  });

program
  .command('generate <directories...>')
  .option('-o, --output <directory>', 'Directory where to put the generated definition')
  .action(function (directories: string[], cmd: { output: string }) {
    new I18nYamlDefinitions(directories, cmd.output).generateDefinitions();
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp(colors.red);
}
