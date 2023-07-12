import bot from "..";
import config, { save } from "../config";
import { Command } from "../command";
import { DMChannel, Message } from "discord.js-selfbot-v13";
import { trueStrings, falseStrings } from "./utils";

bot.on('messageCreate', (message: Message) => {
  if (!config.toggles.blacklist) return;
  if (message.author.id !== bot.user?.id) return;

  if (message.content.includes("blacklist bypass")) return;

  let channelId: string;
  if (message.channel.type == "DM") channelId = (message.channel as DMChannel).recipient.id;
  else channelId = message.channel.id;

  if (!config.blacklist[channelId]) return;

  let alreadyDeleted = false;
  config.blacklist[channelId].forEach(word=>{
    if (alreadyDeleted) return;
    if (message.content.toLowerCase().includes(word.toLocaleLowerCase())) {
      alreadyDeleted = true;
      message.delete();
    }
  })
})

const toggleBlacklist = new Command({
  "name": "blacklist",
  "description": "Toggle message blacklist",
  "usage": "blacklist [on|off]",
  "aliases": ["bl", "black"],
  "callback": async (message, args) => {
    if (!args[0]) {
      message.edit(`Blacklist is currently ${config.toggles.blacklist ? "enabled" : "disabled"}`);
      return;
    }

    if (args[0].toLowerCase() === 'toggle') {
      args[0] = (!config.toggles.blacklist).toString()
    }

    if (trueStrings.includes(args[0].toLowerCase())) {
      config.toggles.blacklist = true;
      save();
      if (message.deletable) message.delete()
      else message.edit("Blacklist enabled");
    } else if (falseStrings.includes(args[0].toLowerCase())) {
      config.toggles.blacklist = false;
      save()
      if (message.deletable) message.delete()
      else message.edit("Blacklist disabled");
    } else {
      message.edit("Invalid argument");
    }
  }
})