exports.go = function(prefix, message) {

  if (message.content.startsWith(prefix + "gray")) {
    message.channel.send("You will never win the heart of my beloved so don't even try! :rage:");
  }
}
