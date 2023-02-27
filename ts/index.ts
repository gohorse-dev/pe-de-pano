#! /usr/bin/env node

import { BotApp } from './App/BotApp';
import { BotAppConfiguration } from './App/BotAppConfiguration';
import { ApplicationParameters } from '@gohorse/npm-application';

const commandLine = process.argv.join(' ');
if (
  commandLine.includes(ApplicationParameters.packageName) ||
  commandLine.includes('ts-node')
) {
  void new BotApp().run();
}

export { BotApp, BotAppConfiguration };
