import { readFileSync, writeFileSync, existsSync } from 'fs'
import { dirname } from 'path';

interface Config {
  toggles: {
    fakeNitro: boolean;
    blacklist: boolean;
  }
  token: string;
  prefix: string;
  owners: string[];
  botWrangler?: {
    token?: string;
    serverId?: string;
  };
  blacklist: { [key: string]: string[] }
}

let config: Config;

let configIsThisDir: boolean;

export function load() {
  if (existsSync('config.json')) {
    config = JSON.parse(readFileSync('config.json').toString());
    configIsThisDir = true;
  }
  else if (dirname('.') == "out" && existsSync('../config.json')) {
    config = JSON.parse(readFileSync('../config.json').toString());
    configIsThisDir = false;
  }
  else throw "Config not found"
}

load();

config = config!!;

if (!config.blacklist) (config.blacklist as any) = {};
export default config;

export function save() {
  console.log('Saving config...');
  writeFileSync(`${!configIsThisDir ? '../' : ''}config.json`, JSON.stringify(config, null, 2))
}