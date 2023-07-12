import bot from "..";
import { Command } from "../command";


const purgeCommand = new Command({
  "name": "purge",
  "description": "Purge your or everyone's messages",
  "usage": "purge [all] <number>",
  "aliases": ["p", "delete"],
  "callback": async (message, args) => {
    try {
    if (message.deletable) await message.delete();
    if (args.length === 0) return message.channel.send("You must specify a number of messages to purge");
    if (args.length > 1) {
      if (args[0] === "all") {
        if (!message.member?.permissions.has("MANAGE_MESSAGES")) return message.channel.send("Unable to purge messages, you do not have the `MANAGE_MESSAGES` permission");
        let messages = await message.channel.messages.fetch({ limit: Number.parseInt(args[1]) })
        messages = messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        for (const message of messages.values()) {
          try {
            await message.delete();
          } catch (e) {}
        }
        return;
      }
      return message.channel.send("You must specify a number of messages to purge");
    }

    let deletedCount = Number.parseInt(args[0]);
    async function recurseDelete() {
      let messages = await message.channel.messages.fetch({ limit: deletedCount });
      if (messages.size === 0) return;
      messages = messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      await messages.forEach(async msg => {
        if (message.author.id !== bot.user!!.id) return;
        try {
          await msg.delete();
          deletedCount--;
        } catch (e) {}
        if (deletedCount > 0) await recurseDelete();
      });
    }
    recurseDelete();
  } catch(e) {console.error(e)}
  }
})