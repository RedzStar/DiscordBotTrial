module.exports.run = async (client, message, args) => {
    if (!args[0]) return message.reply("Debes especificar el nuevo prefijo...");
    const prefix = args[0].toLowerCase();

    await client.db.set(`prefix - ${message.guild.id}`, prefix);
    client.prefix[message.guild.id] = prefix;

    return message.reply(`Se cambio el prefijo a \`${prefix}\` exitosamente.`)

}

module.exports.help = {
    name: "setprefix",
    description: ""
}

module.exports.requirements = {
    ownerOnly = false,
    userPerms: ["MANAGE_GUILD"],
    clientPerms: []
}

exports.conf = {
    aliases: [],
    cooldown: 2
  }