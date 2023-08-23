import bot, { startTime } from "../index";
import { Command } from "../command";
import { load, save, default as config } from "../config";

export const trueStrings = ["true", "yes", "y", "on", "enable", "enabled", "1"];
export const falseStrings = [
  "false",
  "no",
  "n",
  "off",
  "disable",
  "disabled",
  "0",
];

const nopeStrings = [
  "nope",
  "nuh uh",
  "not happening",
  "cmon man youre better than that",
  "really?",
];
export function randomNope() {
  return nopeStrings[Math.floor(Math.random() * nopeStrings.length)];
}

// Ping System
let pingIds: { [key: string]: number } = {};
const pingCommand = new Command({
  name: "ping",
  description: "Get the bot's ping",
  usage: "ping",
  callback: async (message) => {
    pingIds[message.id] = Date.now();
    await message.edit("Pong!");
  },
});
bot.on("messageUpdate", async (_message, message) => {
  if (!pingIds[message.id]) return;
  const startTimeStamp = pingIds[message.id];
  delete pingIds[message.id];
  if (!message.editedTimestamp) return;
  await message.edit(
    `Pong! (⬇${startTimeStamp - message.createdTimestamp}ms ⬆${
      message.editedTimestamp - startTimeStamp
    }ms)`
  );
});

const uptimeCommand = new Command({
  name: "uptime",
  description: "Get the bot's uptime",
  usage: "uptime",
  aliases: ["up"],
  callback: async (message) => {
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

    let messagestr = "Uptime: ";
    if (days > 0) messagestr += `${days}d `;
    if (hours > 0) messagestr += `${hours}h `;
    if (minutes > 0) messagestr += `${minutes}m `;
    if (seconds > 0) messagestr += `${seconds}s `;

    message.edit(messagestr);
  },
});

export default [pingCommand, uptimeCommand];
