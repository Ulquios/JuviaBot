/**
 * Created by theo on 22/06/17.
 */

const Discord = require("discord.js");
const client = new Discord.Client();
const sql = require("sqlite");
const config = require("./config.json");
const fs = require("fs");

// Add commands
const gray = require("./commands/Gray.js");
const help = require("./commands/Help.js");
const ping = require("./commands/Ping.js");
const changePrefix = require("./commands/ChangePrefix.js");
const score = require("./commands/Score.js");

sql.open("./db/score.sqlite");

client.login(config.token);

client.on("ready", () => {
  console.log("I am ready!");
});

// When client send a message
client.on("message", (message) => {

  let prefix = config.prefix;

  // if client is a bot OR is a whisper
  if (message.author.bot || message.channel.type == "dm") return;

  // if client is the owner
  if (message.author.id === config.ownerID) {
    changePrefix.go(prefix, message, fs, config);
  }

  gray.go(prefix, message);
  help.go(prefix, message);
  ping.go(prefix, message);
  score.go(prefix, message, sql);
});
