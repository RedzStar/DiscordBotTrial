const Discord = module.require('discord.js');

var fortunes = [
    "Si.",
    "No.",
    "Por supuesto!",
    "Claro que no!",
    "Tal vez...",
    "No lo se, ¡prueba de nuevo!"
];


module.exports.run = async (bot, message, args) => {

if(!args[0]){
  return message.channel.send("Hazle una pregunta a la gran bola magica de la sabiduria!")
}
if (args[0])  message.channel.send({embed: { color: 0xFFFFFF, title: `8ball! :8ball: `, description: fortunes[Math.floor(Math.random() * fortunes.length)]} }).catch(console.error); //fortunes[Math.floor(Math.random() * fortunes.length)]
else message.channel.send("Tonto! Escribe una pregunta!");
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: []
};

exports.help = {
  name: '8ball',
  description: 'Some random ball that I got off of some shady website',
  usage: '8ball <question>'
};
