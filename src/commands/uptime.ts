import bot, { startTime } from "../index";
import { Command } from "../command";

export default new Command({
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
    
    if (message.author.id == bot.user?.id) message.edit(messagestr)
    else message.channel.send(messagestr);
  },
});
