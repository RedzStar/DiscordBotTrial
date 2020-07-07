const Discord = require("discord.js"), 
      cooldowns = new Discord.Collection(),
      { owners } = require(`../config.json`);
// cooldowns will store the user when they are still in the cooldown mode.

module.exports = async (client, message) => {
  // Prevent any chit-chats with other bots, or by himself.
  if (message.author.bot || message.author === client.user) return;
  
  let prefix = client.config.prefix;
  
  let inviteLink = ["discord.gg", "discord.com/invite", "discordapp.com/invite"];
  
  if (inviteLink.some(word => message.content.toLowerCase().includes(word))) {
    await message.delete();
    return message.channel.send("Bro, no puedes promover tu server aca.")
    .then(m => m.delete({timeout: 10000})) // Add this if you want the message automatically deleted.
  }
  
  // If the user doesn't doing any to the bot, return it.
  if (!message.content.startsWith(prefix)) return;
  
  let args = message.content.slice(prefix.length).trim().split(/ +/g);
  let msg = message.content.toLowerCase();
  let cmd = args.shift().toLowerCase();
  let sender = message.author;
  
  // Many people don't know what is message.flags.
  // We've already seen a bot who has a message.flags or they would called, parameter things.
  message.flags = []
  while (args[0] && args[0][0] === "-") {
    message.flags.push(args.shift().slice(1)); // Example: /play -soundcloud UP pice
  }
  
  let commandFile = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
  if (!commandFile) return; // If the commands doesn't exist, ignore it. Don't send any warning on this.
  
  // This will set a cooldown to a user after typing a command.
  if (!cooldowns.has(commandFile.help.name)) cooldowns.set(commandFile.help.name, new Discord.Collection());
  
  const member = message.member,
        now = Date.now(),
        timestamps = cooldowns.get(commandFile.help.name),
        cooldownAmount = (commandFile.conf.cooldown || 3) * 1000;
  
  if (!timestamps.has(member.id)) {
    if (!client.config.owners.includes(message.author.id)) {
      // If the user wasn't you or other owners that stored in config.json
      timestamps.set(member.id, now);
    }
  } else {
    const expirationTime = timestamps.get(member.id) + cooldownAmount;
    
    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.channel.send(`Wow calmate, debes esperar **${timeLeft.toFixed(1)}** segundos para poder ejecutar este comando.`);
    }
    
    timestamps.set(member.id, now);
    setTimeout(() => timestamps.delete(member.id), cooldownAmount); // This will delete the cooldown from the user by itself.
  }
  
  try {
    if (!commandFile) return;
    commandFile.run(client, message, args);
  } catch (error) {
    console.log(error.message);
  } finally {
    // If you want to really know, who is typing or using your bot right now.
    console.log(`${sender.tag} (${sender.id}) ran a command: ${cmd}`);
  }

  //PERMISIONS
  
  if (!message.guild || message.author.bot) return;

  if (!client.prefix[message.guild.id]) {
     client.prefix[message.guild.id] = await client.db.get(`prefix-${message.guild.id}`, client.prefix["default"]);
  }

  const args = message.content.split(/ +/g);
  const command = args.shift().slice(client.prefix[message.guild.id].length).toLowerCase();
  const cmd = client.commands.get(command);

  if (!message.content.toLowerCase().startsWith(client.prefix[message.guild.id])) return;

  if(!cmd) return;
  if (!message.channel.permissionsFor(message.guild.me).toArray().includes("SEND_MESSAGES")) return;

  if (cmd.requirements.ownerOnly && !owners.includes(message.author.id))
    return message.reply("Solo la dueña del bot puede ejecutar este comando.");

  if (cmd.requirements.userPerms && !message.member.permissions.has(cmd.requirements.userPerms))
    return message.reply(`Debes de tener lo siguientes permisos: ${missingPerms(message.member, cmd.requirements.userPerms)}`);

  if (!cmd.requirements.clientPerms && !message.guild.me.permissions.has(cmd.requirements.clientPerms))
    return message.reply(`Debes tener los siguientes permisos: ${missingPerms(message.guild.me, cmd.requirements.clientPerms)}`);

  cmd.run(client, message, args);

}

  const missingPerms = (member, perms) => {
      const missingPerms = member.permissions.missing(perms)
        .map(str => `\`${str.replace(/_/g, ' ').toLowercase().replace(/\b(\w)/g, char => char.toUpercase())}\``);

      return missingPerms.length > 1 ?
        `${missingPerms.slice(0, -1).join(", ")} and ${missingPerms.slice(-1)[0]}` :
        missingPerms[0];


}

