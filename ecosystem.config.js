module.exports = {
  apps: [{
      name: "selfbot",
      script: "./out/index.js",
      log_file: "selfbot.log",
  }],

  deploy: {
      server: {
          user: "luna",
          host: "dad.lvna.me",
          ref: "origin/main",
          repo: "git@github.com:imlvna/selfbot.git",
          path: "/home/luna/servers/selfbot",
          "post-deploy": "yarn install && yarn build && pm2 startOrRestart ecosystem.config.js"
      }
  }
}