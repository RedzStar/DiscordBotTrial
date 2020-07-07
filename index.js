const Discord = require("discord.js");
const { prefix, token } = require("./config.json")

const bot = require("./handler/ClientBuilder.js"); // We're gonna create this soon.
const client = new bot();

const { VultrexDB } = require("vultrex.db")

const db = new VultrexDB({
    provider: "sqlite",
    table: "main",
    fileName: "main"
});

db.connect().then(() => {
    client.prefix = new Object();
    client.prefix["default"] = prefix;
    client.db = db;

    require("./handler/module.js")(client);
    require("./handler/event.js")(client);

    client.package = require("./package.json");
    client.on("warn", console.warn); // This will warn you via logs if there was something wrong with your bot.
    client.on("error", console.error); // This will send you an error message via logs if there was something missing with your coding.


    client.login(token);

});


