const Discord = require('discord.js');

const client = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION" ]});

module.exports = {
    name: "edit",
    description: "Edits a message in a specific channel",
    async execute(message, args) {
        if (!message.member.hasPermission("ADMINISTRATOR"))
            return message.channel.send('Insuffienct Permissions');
        if (!message.guild.me.hasPermission("MANAGE_CHANNELS"))
            return message.channel.send("I don't have 'MANAGE_CHANNELS'");
        const lastMessage = await message.channel.messages.fetch({ limit: 1 });
        const lastSendMessage = lastMessage.last();
        lastSendMessage.delete();

        

        
    }
};