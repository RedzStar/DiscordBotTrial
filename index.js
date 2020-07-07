const Discord = require("discord.js");
const { prefix, token } = require("./config.json");

const client = new Discord.Client();


require("./handler/module.js")(client);
require("./handler/Event.js")(client);


client.package = require("./package.json");
client.on("warn", console.warn); // This will warn you via logs if there was something wrong with your bot.
client.on("error", console.error); // This will send you an error message via logs if there was something missing with your coding.




client.once('ready', () => {
    console.log('The bot is online!');
});


client.login(token);