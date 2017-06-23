exports.go = function(prefix, message, sql) {

  if (message.content.startsWith(prefix + "level")) {
    sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(row => {
      if (!row || row.level === 0) return message.reply("Juvia don't like you yet, you need to talk more :wink:");
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
          message.reply(`Juvia loves you **${curLevel}** times now! Good job...\n
          https://s-media-cache-ak0.pinimg.com/736x/28/89/60/2889603048ca62e03b70c3f390debd3b.jpg`);
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
}
