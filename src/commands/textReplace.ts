import bot from "..";
import { Command } from "../command";
import config, { save } from "../config";
import { falseStrings, trueStrings } from "./utils";

bot.on("messageCreate", async (message) => {
  if (message.author.id !== bot.user!.id) return;
  if (!config.toggles.replacements) return;
  Object.entries(config.replacements).forEach(([key, value]) => {
    if (message.content.includes(key)) {
      message.edit(message.content.replaceAll(key, value));
    }
  });
});

export default new Command({
  name: "replace",
  description: "Toggle text replacements",
  usage: "replace [on|off]",
  aliases: ["r"],
  ownerOnly: true,
  callback: async (message, args) => {
    if (!args[0]) {
      message.edit(
        `Replacements are currently ${
          config.toggles.replacements ? "enabled" : "disabled"
        }`
      );
      return;
    }

    if (args[0].toLowerCase() === "toggle") {
      args[0] = (!config.toggles.replacements).toString();
    }

    if (trueStrings.includes(args[0].toLowerCase())) {
      config.toggles.replacements = true;
      save();
      message.edit("Replacements enabled");
    } else if (falseStrings.includes(args[0].toLowerCase())) {
      config.toggles.replacements = false;
      save();
      message.edit("Replacements disabled");
    } else {
      message.edit("Invalid argument");
    }
  },
});
