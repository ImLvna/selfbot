import { Client } from 'discord.js-selfbot-v13'

import config from './config'

const bot = new Client({
  checkUpdate: false
})

export default bot;

import('./modules')

export let startTime = Date.now();

bot.on('ready', () => {
  if (!bot.user) return; // This should never happen
  bot.user.setPresence({status: "invisible", afk: true})
  console.log(`Logged in as ${bot.user?.username}!`)
  if (!config.owners.includes(bot.user.id)) config.owners.push(bot.user.id);
  startTime = Date.now();
})

bot.login(config.token);