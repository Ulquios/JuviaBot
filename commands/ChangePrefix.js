exports.go = function(prefix, message, fs, config) {

  if (message.content.startsWith(prefix + "prefix")) {
    let newPrefix = message.content.split(" ").slice(1, 2)[0];
    config.prefix = newPrefix;
    fs.writeFile("./../config.json", JSON.stringify(config), (err) => console.error);
    message.channel.send("Now you can call me using : " + config.prefix);
  }
}
