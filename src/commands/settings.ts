import { Command } from "../command";
import { save, load, default as config } from "../config";
import { randomNope } from "./utils";

const saveCommand = new Command({
  name: "save",
  description: "Save the config",
  usage: "save",
  callback: (message) => {
    save();
  },
});
const reloadCommand = new Command({
  name: "reload",
  description: "Reload the config",
  usage: "reload",
  aliases: ["load"],
  callback: (message) => {
    load();
  },
});
const setCommand = new Command({
  name: "setting",
  description: "Change a setting",
  usage: "setting [setting] [value]",
  aliases: ["set", "settings"],
  callback: (message, args) => {
    if (args.length === 0 || !Object.keys(config).includes(args[0])) {
      let configStr = ["**Available config values:**"];
      Object.entries(config).forEach((i) => {
        if (typeof i[1] !== "object" || Array.isArray(i[1])) {
          if (i[0] == "token") i[1] = "`<redacted>`";
          configStr.push(`- ${i[0]}: \`${i[1]}\``);
        } else {
          configStr.push(`- ${i[0]}:`);
          Object.entries(i[1]).forEach((a) => {
            if (a[0] == "token") a[1] = "`<redacted>`";
            configStr.push(`> ${a[0]}: \`${a[1]}\``);
          });
        }
      });
      configStr.push("<blacklist bypass>");
      message.channel.send(configStr.join("\n"));
    } else if (args.length === 1) {
      if (args[0] === "token") return message.channel.send(randomNope());
      message.channel.send(
        `Setting \`${args[0]}\` is currently \`${(config as any)[args[0]]}\``
      );
    } else {
      let setting = args.shift() as string;
      let value: any;
      try {
        value = JSON.parse(args.join(" "));
      } catch (e) {
        value = args.join(" ");
      }
      (config as any)[setting] = value;
      save();
      message.channel.send(`${setting} is now \`${value}\``);
    }
  },
});

export default [saveCommand, reloadCommand, setCommand];
