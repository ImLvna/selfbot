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