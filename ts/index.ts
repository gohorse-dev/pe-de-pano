#! /usr/bin/env node

import { BotApp } from './App/BotApp';
import { BotAppConfiguration } from './App/BotAppConfiguration';
import { ApplicationParameters } from '@gohorse/npm-application';

const commandLine = process.argv.join(' ');
const regexHasIndexFile = /[^\s]*\bnode\b[^\s]*\s[^\s]*\bindex\.js\b[^\s]*/;
if (
  commandLine.includes(ApplicationParameters.packageName) ||
  commandLine.includes('ts-node') ||
  regexHasIndexFile.test(commandLine)
) {
  void new BotApp().run();
}

export { BotApp, BotAppConfiguration };
