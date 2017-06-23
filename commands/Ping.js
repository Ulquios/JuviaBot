exports.go = function(prefix, message) {

  if (message.content.startsWith(prefix + "ping")) {
    message.channel.send("pong!");
  }
}
