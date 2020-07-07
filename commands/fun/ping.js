const Discord = require('discord.js');

exports.run = async (client, message, args) => {
  message.channel.send("Pong!");
}

exports.help = {
  name: "ping",
  description: "Ponged!",
  usage: "j!ping",
  example: "j!ping"
};

exports.conf = {
  aliases: ["ms"],
  cooldown: 5 // This number is a seconds, not a milliseconds.
  // 1 = 1 seconds.
}