exports.go = function(prefix, message) {

  if (message.content.startsWith(prefix + "help")) {
     message.channel.send("You can use these commands:\n\n```ping\ngray\npoints\nlevel```\n\n Have fun :heart:");
  }
}
