import bot from "..";
import { blacklist } from "../config";
import { Command } from "../command";
import { DMChannel, Message } from "discord.js-selfbot-v13";
import { trueStrings, falseStrings } from "./utils";
var blacklistEnabled = true;

bot.on('messageCreate', (message: Message) => {
  if (!blacklistEnabled) return;
  if (message.author.id !== bot.user?.id) return;

  let channelId: string;
  if (message.channel.type == "DM") channelId = (message.channel as DMChannel).recipient.id;
  else channelId = message.channel.id;

  if (!blacklist[channelId]) return;

  let alreadyDeleted = false;
  blacklist[channelId].forEach(word=>{
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
      message.edit(`Blacklist is currently ${blacklistEnabled ? "enabled" : "disabled"}`);
      return;
    }

    if (args[0].toLowerCase() === 'toggle') {
      args[0] = (!blacklistEnabled).toString()
    }

    if (trueStrings.includes(args[0].toLowerCase())) {
      blacklistEnabled = true;
      if (message.deletable) message.delete()
      else message.edit("Blacklist enabled");
    } else if (falseStrings.includes(args[0].toLowerCase())) {
      blacklistEnabled = false;
      if (message.deletable) message.delete()
      else message.edit("Blacklist disabled");
    } else {
      message.edit("Invalid argument");
    }
  }
})