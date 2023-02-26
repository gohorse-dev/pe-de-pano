#! /usr/bin/env node

import { DiscordBotApp } from './DiscordBot/DiscordBotApp';
import { DiscordBotAppConfiguration } from './DiscordBot/DiscordBotAppConfiguration';
import { ApplicationParameters } from '@gohorse/npm-application';

const commandLine = process.argv.join(' ');
if (
  commandLine.includes(ApplicationParameters.packageName) ||
  commandLine.includes('ts-node')
) {
  void new DiscordBotApp().run();
}

export { DiscordBotApp, DiscordBotAppConfiguration };
