import { Client } from "discord.js-selfbot-v13";

import config from "./config";
import { commands, registerCommands } from "./command";

const bot = new Client({
  checkUpdate: false,
});

export default bot;

export let startTime = Date.now();

bot.on("ready", async () => {
  bot.user!.setPresence({ status: "invisible", afk: true });
  await registerCommands();
  console.log(
    `Logged in as ${bot.user?.username}! ${commands.length} commands registered!`
  );
  if (!config.owners.includes(bot.user!.id)) config.owners.push(bot.user!.id);
  startTime = Date.now();
});

bot.login(config.token);
