import { Command, _commands } from "../command";
import config from "../config";

function genHelp(command: Command) {
  const aliases = command.aliases.filter(alias => alias !== command.name);
  let msg = [
    `**${command.name}**`,
    `- ${command.description}`,
    `Usage: \`${config.prefix}${command.usage}\``,
  ];
  if (aliases.length > 0) msg.push(`Aliases: ${aliases.map(alias => `\`${alias}\``).join(', ')}`);
  return msg.join('\n');
}


const helpCommand = new Command({
  "name": "help",
  "description": "Get help with a command",
  "usage": "help [command]",
  "aliases": ["h"],
  "callback": async (message, args) => {
    if (args.length === 0) {
      const helpEntries = _commands.map(command => genHelp(command));
      await message.edit(helpEntries.join('\n\n'));
    }
    else {
      const command = _commands.find(cmd => cmd.aliases.includes(args[0]));
      if (!command) return;
      await message.edit(genHelp(command));
    }
  }
})