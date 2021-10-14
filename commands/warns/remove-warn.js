const { Message, MessageEmbed } = require('discord.js');

const db = require('../../models/warns')

module.exports = {
    name : 'rwarn',
    async execute (message, args) {
        
        const lastMessage = await message.channel.messages.fetch({ limit: 1 });
        const lastSendMessage = lastMessage.last();

        if(!message.member.hasPermission('MANAGE_ROLES'))
            return lastSendMessage.lineReplyNoMention('You do not have permission to use this command.');
        
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if(!user)
            return lastSendMessage.lineReplyNoMention('User not found.');


        db.findOne({ guildid : message.guild.id, user: user.user.id}, async(err,data) => {
            if(err)
                throw err;
            
            if(data) {
                let number = parseInt(args[1]) - 1;
                data.content.splice(number, 1);
                lastSendMessage.lineReplyNoMention(`Deleted warn: ${number + 1} | From: ${user.user.id}`);
                data.save();
            }
            else {
                lastSendMessage.lineReplyNoMention('This user does not have any warns in this server!');
            }
        });
    }
};
