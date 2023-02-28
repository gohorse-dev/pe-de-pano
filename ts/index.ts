#! /usr/bin/env node

import { DiscordBotApp } from './App/DiscordApp/DiscordBotApp';
import { DiscordBotAppConfiguration } from './App/DiscordApp/DiscordBotAppConfiguration';
import { ApplicationParameters } from '@gohorse/npm-application';

const commandLine = process.argv.join(' ');
const regexHasIndexFile = /[^\s]*\bnode\b[^\s]*\s[^\s]*\bindex\.js\b[^\s]*/;
if (
  commandLine.includes(ApplicationParameters.packageName) ||
  commandLine.includes('ts-node') ||
  regexHasIndexFile.test(commandLine)
) {
  void new DiscordBotApp().run();
}

export { DiscordBotApp, DiscordBotAppConfiguration };
