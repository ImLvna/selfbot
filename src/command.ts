import { Message, PartialMessage } from "discord.js-selfbot-v13";

import bot from './index'
import { prefix, owners } from "./config";

export const _commands: Command[] = [];

export interface CommandMessage extends Message {
  prefix: string;
  usedName: string;
  name: string;
}


interface CommandOptions {
  name: string;
  description: string;
  usage: string;
  aliases?: string[];
  callback: (message: CommandMessage, args: string[]) => void;
}
export class Command {
  description: string;
  usage: string;
  name: string;
  aliases: string[];

  callback: (message: CommandMessage, args: string[]) => void;

  constructor(options: CommandOptions) {
    this.description = options.description;
    this.usage = options.usage;
    this.name = options.name;
    this.aliases = options.aliases || [] as string[];
    this.aliases.push(this.name);

    this.callback = options.callback;

    _commands.push(this);
  }
}

async function possiblyTriggerCommand(message: Message|PartialMessage, newMessage?: Message|PartialMessage) {
  if (newMessage) message = newMessage;
  if (message.partial) message = await message.fetch();

  if (!owners.includes(message.author.id)) return; 
  if (!message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift()?.toLowerCase();
  if (!command) return;
  const cmd = _commands.find(cmd => cmd.aliases.includes(command));
  if (!cmd) return;

  const cmdMessage = message as CommandMessage;
  cmdMessage.prefix = prefix;
  cmdMessage.usedName = command;
  cmdMessage.name = cmd.name;

  cmd.callback(cmdMessage, args);
}

bot.on('messageCreate', possiblyTriggerCommand);
bot.on('messageUpdate', possiblyTriggerCommand);