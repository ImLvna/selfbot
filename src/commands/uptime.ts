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
    
    export default new Command({
      aliases: ['ping'],
      name: 'ping',
      description: 'Ping the bot',
      usage: '+ping',
      callback: async (context) => {
        let now = Date.now();
        let m = await context.channel.send(`Pong! 
        Gateway (Receiving): ${context.bot.ws.ping}ms
        Rest (Sending): ...`);
        await m.edit(`Pong!
        Gateway (Receiving): ${context.bot.ws.ping}ms
        Rest (Sending): ${Date.now() - now}ms`);
      }
    })
  },
});
