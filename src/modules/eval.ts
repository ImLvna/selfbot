import { Client, Message, WebEmbed } from 'discord.js-selfbot-v13'
import ts from 'typescript'

import bot from '../';
import { Command, CommandMessage } from '../command'

var _global = {} as any;
const _bot = bot

async function callback(message: CommandMessage, args: string[]) {
  const codeRegex = /(`{1,3})((?:js)|(?:ts))?\n?\r?((?:.|\n.(?!`))+)\n?\r?\1/g
  let data = codeRegex.exec(args.join(' '));
  let output = [] as string[];
  let cnsle = console
  console = new Proxy(cnsle, {
    get(target, prop: string, receiver) {
      if (["log", "error", "info"].includes(prop)) {
        return function () { Array.from(arguments).forEach(arg => output.push(arg.toString())); }
      }
      return Reflect.get(target, prop, receiver);
    }
  });
  let code = data?.[3];
  if (!code) {
    code = args.join(' ');
    if (!code) return message.channel.send("No code provided");
  }

  const utils = {
    async referencedMessage() {
      return await message.channel.messages.fetch(message.reference?.messageId as string);
    },
    async ref() {
      return await message.channel.messages.fetch(message.reference?.messageId as string);
    },
    list() {
      return Object.keys(utils);
    }
  }


  try {
    if (data?.[2] == "ts") code = ts.transpile(code);

    let _output: any;
    if (message.name === "aeval") _output = await eval(`(async () => {${code}})()`);
    else _output = await eval(code);
    output.push(`> ${_output}`)
  } catch (e) {
    output.push(`Error: ${e}`);
  }
  console = cnsle;

  if (message.name !== "seval") await message.channel.send(`\`\`\`js\n${output.join('\n')}\n\`\`\``);
}

const evalCommand = new Command({
  "name": "eval",
  "description": "Evaluate javascript",
  "usage": "eval <code>",
  "aliases": ["e"],
  "callback": callback
})

const asyncEvalCommand = new Command({
  "name": "aeval",
  "description": "Evaluate javascript asynchronously",
  "usage": "aeval <code>",
  "aliases": ["ae"],
  "callback": callback
})

const silentEvalCommand = new Command({
  "name": "seval",
  "description": "Evaluate javascript silently",
  "usage": "seval <code>",
  "aliases": ["se"],
  "callback": callback
})