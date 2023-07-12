import bot, { startTime } from "../index";
import { Command } from "../command";
import { load, save, default as config } from "../config";

export const trueStrings = ["true", "yes", "y", "on", "enable", "enabled", "1"];
export const falseStrings = ["false", "no", "n", "off", "disable", "disabled", "0"];

const nopeStrings = ["nope", "nuh uh", "not happening", "cmon man youre better than that", "really?"]
export function randomNope() {
  return nopeStrings[Math.floor(Math.random() * nopeStrings.length)];
}

// Ping System
let pingIds: { [key: string]: number } = {}
const pingCommand = new Command({
  "name": "ping",
  "description": "Get the bot's ping",
  "usage": "ping",
  callback: async (message) => {
    pingIds[message.id] = Date.now();
    await message.edit("Pong!");
  }
})
bot.on('messageUpdate', async (_message, message) => {
  if (!pingIds[message.id]) return;
  const startTimeStamp = pingIds[message.id]
  delete pingIds[message.id];
  if (!message.editedTimestamp) return;
  await message.edit(`Pong! (⬇${startTimeStamp - message.createdTimestamp}ms ⬆${message.editedTimestamp - startTimeStamp}ms)`);
})

const uptimeCommand = new Command({
  "name": "uptime",
  "description": "Get the bot's uptime",
  "usage": "uptime",
  "aliases": ["up"],
  "callback": async (message) => {
    // Convert milliseconds to days, hours, minutes and seconds
    let ms = Date.now() - startTime;
    let days = Math.floor(ms / 86400000);
    ms %= 86400000;
    let hours = Math.floor(ms / 3600000);
    ms %= 3600000;
    let minutes = Math.floor(ms / 60000);
    ms %= 60000;
    let seconds = Math.floor(ms / 1000);
    ms %= 1000;

    let messagestr = 'Uptime: ';
    if (days > 0) messagestr += `${days}d `;
    if (hours > 0) messagestr += `${hours}h `;
    if (minutes > 0) messagestr += `${minutes}m `;
    if (seconds > 0) messagestr += `${seconds}s `;

    message.edit(messagestr);
  }
})

const saveCommand = new Command({
  "name": "save",
  "description": "Save the config",
  "usage": "save",
  "callback": (message) => {
    save()
  }
})
const reloadCommand = new Command({
  "name": "reload",
  "description": "Reload the config",
  "usage": "reload",
  "aliases": ["load"],
  "callback": (message) => {
    load()
  }
})
const setCommand = new Command({
  "name": "setting",
  "description": "Change a setting",
  "usage": "setting",
  "aliases": ["set", "settings"],
  "callback": (message, args) => {
    if (args.length === 0 || !Object.keys(config).includes(args[0])) {
      let configStr = ["**Available config values:**"];
      Object.entries(config).forEach(i=>{
        if (typeof i[1] !== "object" || Array.isArray(i[1])) {
          if (i[0] == "token") i[1] = "`<redacted>`"
          configStr.push(`- ${i[0]}: \`${i[1]}\``);
        }
        else {
          configStr.push(`- ${i[0]}:`)
          Object.entries(i[1]).forEach(a=>{
            if (a[0] == "token") a[1] = "`<redacted>`"
            configStr.push(`> ${a[0]}: \`${a[1]}\``)
          })
        }
      })
      configStr.push('<blacklist bypass>')
      message.channel.send(configStr.join('\n'))
    } else if (args.length === 1) {
      if (args[0] === "token") return message.channel.send(randomNope())
      message.channel.send(`Setting \`${args[0]}\` is currently \`${(config as any)[args[0]]}\``)
    } else {
      let setting = args.shift() as string;
      try {
        (config as any)[setting] = JSON.parse(args.join(' '))
      } catch(e) {
        (config as any)[setting] = args.join(' ')
      }
    }
  }
})