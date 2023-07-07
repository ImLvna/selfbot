import { Channel, Client, Guild } from "discord.js";
import { botWrangler, prefix, owners, token } from "../config";
import bot from "../";
import { TextChannel } from "discord.js-selfbot-v13";


async function go() {

  if (!botWrangler) return console.log("No botWrangler config found, skipping botWrangler module");
  if (!botWrangler.token) return console.log("No botWrangler token found, skipping botWrangler module");
  if (!botWrangler.serverId) return console.log("No botWrangler serverId found, skipping botWrangler module");

  const wrangler = new Client({
    intents: ["Guilds", "GuildMessages", "MessageContent"]
  });

  let guild: Guild;
  wrangler.on("ready", async () => {
    if (!botWrangler?.serverId) return; //will be caught earlier, this is to make typescript happy
    guild = await wrangler.guilds.fetch(botWrangler.serverId);
  })

  wrangler.on("messageCreate", async (message) => {
    if (message.guild?.id !== botWrangler?.serverId) return;
    if (!owners.includes(message.author.id)) return;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift()?.toLowerCase();

    if (!command) return;

    switch (command) {
      case "login":
        bot.destroy();
        bot.login(token);
        setTimeout(async () => {
          try {
            let botChannel = await bot.channels.fetch(message.channelId) as TextChannel;
            if (!botChannel) message.channel.send('Logged in!');
            else botChannel.send('Logged in!');
          } catch (e) {
            message.channel.send('Logged in!');
          }
        }, 1000);
        break;
      
      case "logout":
        bot.destroy();
        message.reply("Logged out!");
        break;
    }
  })

  wrangler.on('ready', async () => {
    console.log("Wrangler logged in as " + wrangler.user?.tag);
  })
  wrangler.login(botWrangler.token);
}

go();