import I18nYamlDefinitions from '../src/I18nYamlDefinitions';
import * as fs from 'fs';
import { rm } from 'shelljs';

const expectedOutputPath = __dirname + '/I18n.expected.d.ts';
const outputPath = __dirname + '/I18n.d.ts';

const cleanOutputFile = () => {
  if (fs.existsSync(outputPath)) {
    rm(outputPath);
  }
};

beforeEach(cleanOutputFile);
afterEach(cleanOutputFile);

describe('cli tests', () => {
  it('can generate definitions', async () => {
    process.argv = ['', '', 'generate', 'tests/locales/en', 'tests/locales/en-CA', '-o', 'tests'];

    await import('../src/i18n-typedef');

    const file = fs.readFileSync(outputPath, 'utf8');
    expect(file).not.toBeNull();
    expect(file).toContain('type I18n');
  });
});

describe('I18nYamlDefinitions tests', () => {
  it('is instantiable', () => {
    expect(new I18nYamlDefinitions([], '')).toBeInstanceOf(I18nYamlDefinitions);
  });

  it('does not crash when there is no I18n files', () => {
    new I18nYamlDefinitions([`${__dirname}/no-locales`], __dirname).generateDefinitions();

    expect(fs.existsSync(outputPath)).toBeFalsy();
  });

  it('generates definitions file', () => {
    const expectedOutput = fs.readFileSync(expectedOutputPath, 'utf8');

    const i18nDefinitionCreator = new I18nYamlDefinitions(
      [`${__dirname}/locales/en`, `${__dirname}/locales/en-CA`],
      __dirname,
    );

    i18nDefinitionCreator.generateDefinitions();

    const file = fs.readFileSync(outputPath, 'utf8');
    expect(file).not.toBeNull();
    expect(file).toContain('type I18n');
    expect(file).toBe(expectedOutput);
  });
});
