const { Message, MessageEmbed } = require('discord.js');

const db = require('../../models/warns')

module.exports = {
    name : 'clearwarns',
    async execute(message, args) {
        
        const lastMessage = await message.channel.messages.fetch({ limit: 1 });
        const lastSendMessage = lastMessage.last();
        
        if(!message.member.hasPermission('MANAGE_ROLES'))
            return message.channel.send('You do not have permission to use this command.');
        
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if(!user) 
            return lastSendMessage.lineReplyNoMention('User not found.');

        db.findOne({ guildid : message.guild.id, user: user.user.id}, async(err, data) => {
            if(err)
                throw err;
            
            if(data) {
                await db.findOneAndDelete({ user : user.user.id, guildid: message.guild.id });
                message.channel.send(new MessageEmbed()
                    .setDescription(`\`Cleared ${user.user.tag}'s current warns.\``)
                );
            } else {
                message.channel.send('This user does not have any warns in this server!');
            }
        });
    }
};
