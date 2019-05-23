import * as program from 'commander'
import * as chokidar from 'chokidar'
import I18nYamlDefinitions from './I18nYamlDefinitions'

program
  .command('watch <directories...>')
  .option('-o, --output <directory>', 'Directory where to put the generated definition')
  .action(function(directories: string[], cmd: { output: string }) {
    const i18nYamlDefinitions = new I18nYamlDefinitions(directories, cmd.output)

    const listener = (path: string, filename: string) => {
      console.log(`[i18n-typedef] ${path} changed`)
      i18nYamlDefinitions.generateDefinitions()
    }

    chokidar
      .watch(directories, {
        ignoreInitial: true,
        awaitWriteFinish: {
          stabilityThreshold: 500,
          pollInterval: 100
        }
      })
      .on('add', listener)
      .on('change', listener)
      .on('unlink', listener)

    i18nYamlDefinitions.generateDefinitions()
  })

program.parse(process.argv)
