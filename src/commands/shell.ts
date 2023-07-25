import { Message } from "discord.js-selfbot-v13";
import { exec, ChildProcess } from "child_process";
import { Command, CommandMessage } from "../command";

let runningProcesses: ChildProcess[] = [];


const shorthands = [
  "gh",
  "docker"
]

const shellCommand = new Command({
  name: "shell",
  description: "Run shell commands",
  usage: "shell <command>",
  aliases: ["sh", "bash", "zsh"].concat(shorthands),
  callback: async (message: CommandMessage, args: string[]) => {

    if (shorthands.includes(message.usedName)) args.unshift(message.usedName)
    const command = args.join(" ");

    let output: string[] = [];

    let res = await message.channel.send(`Running \`${command}\`...`);

    const child = exec(command, { shell: "zsh" });

    runningProcesses.push(child);

    child.stdout?.on("data", (data) => {
      data.split("\n").forEach((line: string) => {
        if (line === "") return;
        output.push(line);
      });
    });

    const updateOutput = async () => {
      if (output.length === 0) return;
      // When the output is over 2000 characters, make a new message
      if (output.join("\n").length > 2000) {
        console.log("over2k");
        let newOutput = Array.from(output);
        while (newOutput.join("\n").length > 2000) {
          newOutput.pop();
          output.reverse().pop();
          output.reverse();
        }
        res.edit(`\`\`\`\n${newOutput.join("\n")}\n\`\`\``);
        res = await message.channel.send(
          `\`\`\`\n${output.join("\n")}\n\`\`\``
        );
      } else if (`\`\`\`\n${output.join("\n")}\n\`\`\`` !== res.content) {
        res.edit(`\`\`\`\n${output.join("\n")}\n\`\`\``);
      }
    };

    const interval = setInterval(updateOutput, 500);

    let closed = false;
    const onClose = () => {
      if (closed) return;
      closed = true;
      clearInterval(interval);
      runningProcesses = runningProcesses.filter((p) => p !== child);
      if (child.killed) output.push("Process killed");
      if (child.exitCode && child.exitCode !== 0)
        output.push(`Process exited with code ${child.exitCode}`);
      updateOutput();
    };
    child.on("close", onClose);
    child.on("exit", onClose);
  },
});

const stopCommand = new Command({
  name: "stop",
  description: "Stops all running subprocesses",
  usage: "stop",
  callback: async (message: CommandMessage, args: string[]) => {
    if (runningProcesses.length === 0) {
      await message.channel.send("No running processes!");
      return;
    }

    await message.channel.send(
      `Stopping ${runningProcesses.length} processes...`
    );

    runningProcesses.forEach((p) => {
      p.kill();
    });
  },
});

export default [shellCommand, stopCommand];
