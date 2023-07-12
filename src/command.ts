import { Message, PartialMessage } from "discord.js-selfbot-v13";

import bot from './index'
import config from "./config";

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

  if (!config.owners.includes(message.author.id)) return; 
  if (!message.content.startsWith(config.prefix)) return;
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);

  let chosenAlias: string|undefined;
  const command = _commands.find(cmd => {
    // Command aliases can have spaces
    const aliases = cmd.aliases.map(alias => alias.split(/ +/g));
    const alias = aliases.find(alias => {
      const match = args.slice(0, alias.length).join(' ') === alias.join(' ');
      if (match) chosenAlias = alias.join(' ');
      return match;
    })
    return !!alias;
  });
  if (!command || !chosenAlias) return;

  for (let i = 0; i < chosenAlias.split(/ +/g).length; i++) args.shift();

  const cmdMessage = message as CommandMessage;
  cmdMessage.prefix = config.prefix;
  cmdMessage.usedName = chosenAlias;
  cmdMessage.name = command.name;

  command.callback(cmdMessage, args);
}

bot.on('messageCreate', possiblyTriggerCommand);
bot.on('messageUpdate', possiblyTriggerCommand);