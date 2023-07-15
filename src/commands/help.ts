import { Command, commands } from "../command";
import config from "../config";

function genHelp(command: Command) {
  const aliases = command.aliases.filter((alias) => alias !== command.name);
  let msg = [
    `**${command.name}**`,
    `- ${command.description}`,
    `Usage: \`${config.prefix}${command.usage}\``,
  ];
  if (aliases.length > 0)
    msg.push(`Aliases: ${aliases.map((alias) => `\`${alias}\``).join(", ")}`);
  return msg.join("\n");
}

export default new Command({
  name: "help",
  description: "Get help with a command",
  usage: "help [command]",
  aliases: ["h"],
  callback: async (message, args) => {
    if (args.length === 0) {
      const helpEntries = commands.map((command: Command) => genHelp(command));
      await message.edit(helpEntries.join("\n\n"));
    } else {
      const command = commands.find((command: Command) =>
        command.aliases.includes(args[0])
      );
      if (!command) return;
      await message.edit(genHelp(command));
    }
  },
});
