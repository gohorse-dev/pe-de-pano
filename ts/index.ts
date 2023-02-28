#! /usr/bin/env node

import { DiscordBotApp } from './App/DiscordApp/DiscordBotApp';
import { DiscordBotAppConfiguration } from './App/DiscordApp/DiscordBotAppConfiguration';
import { ApplicationParameters } from '@gohorse/npm-application';

const commandLine = process.argv.join(' ');
if (
  commandLine.includes(ApplicationParameters.packageName) ||
  commandLine.includes('ts-node')
) {
  void new DiscordBotApp().run();
}

export { DiscordBotApp, DiscordBotAppConfiguration };
