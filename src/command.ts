import { Message, PartialMessage } from "discord.js-selfbot-v13";

import config from "./config";
import bot from ".";
import { readdirSync } from "fs";
import { join } from "path";

export const commands: Command[] = [];

export interface CommandMessage extends Message {
  prefix: string;
  usedName: string;
  command: Command;
}

interface CommandOptions {
  name: string;
  description: string;
  usage: string;
  aliases?: string[];
  ownerOnly?: boolean;
  callback: (message: CommandMessage, args: string[]) => void;
}
export class Command {
  description: string;
  usage: string;
  name: string;
  aliases: string[];
  ownerOnly: boolean;
  data: boolean;

  callback: (message: CommandMessage, args: string[]) => void;

  constructor(options: CommandOptions) {
    this.description = options.description;
    this.usage = options.usage;
    this.name = options.name;
    this.aliases = options.aliases || ([] as string[]);
    this.aliases.push(this.name);
    this.ownerOnly = options.ownerOnly || false;
    this.data = false; // This is so the command is interpreted as a prefix command

    this.callback = options.callback;
  }
}

async function possiblyTriggerPrefixCommand(
  message: Message | PartialMessage,
  newMessage?: Message | PartialMessage
) {
  if (newMessage) message = newMessage;
  if (message.partial) message = await message.fetch();
  if (!config.owners.includes(message.author.id)) return;
  if (!message.content.startsWith(config.prefix)) return;
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);

  let chosenAlias: string | undefined;
  const command = commands.find((cmd) => {
    // Command aliases can have spaces
    const aliases = cmd.aliases.map((alias) => alias.split(/ +/g));
    const alias = aliases.find((alias) => {
      const match = args.slice(0, alias.length).join(" ") === alias.join(" ");
      if (match) chosenAlias = alias.join(" ");
      return match;
    });
    return !!alias;
  });
  if (!command || !chosenAlias) return;

  for (let i = 0; i < chosenAlias.split(/ +/g).length; i++) args.shift();

  const cmdMessage = message as CommandMessage;
  cmdMessage.prefix = config.prefix;
  cmdMessage.usedName = chosenAlias;
  cmdMessage.command = command;

  try {
    command.callback(cmdMessage, args);
  } catch (e) {
    message.channel.send("There was an error running the command");
  }
}

function registerEvents() {
  bot.on("messageCreate", possiblyTriggerPrefixCommand);
  bot.on("messageUpdate", possiblyTriggerPrefixCommand);
}

export async function registerCommands() {
  const commandFiles = readdirSync(join(__dirname, "commands")).filter(
    (file) => !file.endsWith(".map")
  );

  for (const file of commandFiles) {
    const command = await import(join(__dirname, "commands", `${file}`));

    command.default = command.default as Command | Command[];

    if (!Array.isArray(command.default)) commands.push(command.default);
    else command.default.forEach((command: Command) => commands.push(command));
  }
  await registerEvents();
}
