/**
 * Created by theo on 22/06/17.
 */

const Discord = require("discord.js");
const client = new Discord.Client();
const sql = require("sqlite");
const config = require("./config.json");
const fs = require("fs")

sql.open("./score.sqlite");

client.login(config.token);

client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", (message) => {

  let prefix = config.prefix;

  if (message.author.bot || message.channel.type === "dm") return;

  // Basic ping pong command
  if (message.content.startsWith(prefix + "ping")) {
    message.channel.send("pong!");
  }

  // Talking about gray ?
  if (message.content.startsWith(prefix + "gray")) {
    message.channel.send("You will never win the heart of my beloved so don't even try! :rage:");
  }

  // Display Help
  if (message.content.startsWith(prefix + "help")) {
     message.channel.send("You can use these commands:\n\n```ping\ngray\npoints\nlevel```\n\n Have fun :heart:");
  }

  if (message.content.startsWith(prefix + "level")) {
    sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(row => {
      if (!row || row.level === 0) return message.reply("Juvia don't like you yet, keep up spamming :wink:");
      message.reply(`Juvia loves you ${row.level} times :heart:`);
    });
  } else if (message.content.startsWith(prefix + "points")) {
    sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(row => {
      if (!row) return message.reply("Juvia is not happy, you don't get any points :cry:");
      message.reply(`Juvia is really happy, you got ${row.points} points, good going!`);
    });
  } else {
    sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(row => {
      if (!row) {
        sql.run("INSERT INTO scores (userId, points, level) VALUES (?, ?, ?)", [message.author.id, 1, 0]);
      } else {
        let curLevel = Math.floor(0.1 * Math.sqrt(row.points + 1));
        if (curLevel > row.level) {
          row.level = curLevel;
          sql.run(`UPDATE scores SET points = ${row.points + 1}, level = ${row.level} WHERE userId = ${message.author.id}`);
          message.reply(`You've leveled up to level **${curLevel}**! Ain't that dandy?`);
        }
        sql.run(`UPDATE scores SET points = ${row.points + 1} WHERE userId = ${message.author.id}`);
      }
    }).catch(() => {
      console.error;
      sql.run("CREATE TABLE IF NOT EXISTS scores (userId TEXT, points INTEGER, level INTEGER)").then(() => {
        sql.run("INSERT INTO scores (userId, points, level) VALUES (?, ?, ?)", [message.author.id, 1, 0]);
      });
    });
  }

  if(message.author.id !== config.ownerID) return;

  // Changing prefix command
  if(message.content.startsWith(prefix + "prefix")) {
    let newPrefix = message.content.split(" ").slice(1, 2)[0];
    config.prefix = newPrefix;
    fs.writeFile("./config.json", JSON.stringify(config), (err) => console.error);
  }
});
