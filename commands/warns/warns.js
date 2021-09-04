const db = require('../../models/warns');

const { Message, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'warns',
    async execute(message, args) {
        
        const lastMessage = await message.channel.messages.fetch({ limit: 1 });
        const lastSendMessage = lastMessage.last();
        
        if (!message.member.hasPermission('ADMINISTRATOR'))
            return lastSendMessage.lineReplyNoMention('You do not have the permission to use this command.');
        
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!user)
            return lastSendMessage.lineReplyNoMention('User not found.');
        
        const reason = args.slice(1).join(' ');

        db.findOne({ guildid: message.guild.id, user: user.user.id }, async(err, data) => {
            if (err)
                throw err;
            
            if (data) {
                lastSendMessage.lineReplyNoMention(new MessageEmbed()
                    .setTitle(`Warns - ${user.user.tag}`)
                    .setDescription(
                        data.content.map(
                            (w, i) =>
                            `\`${i + 1}\` | Moderator : ${message.guild.members.cache.get(w.moderator).user.tag}\nReason : ${w.reason}\n`
                        )
                    )
                    .setColor('BLUE')
                );
            }
            else {
                lastSendMessage.lineReplyNoMention(new MessageEmbed()
                    .setDescription(`\`${user.user.tag} has no warns.\``)
                );
            }
        });
    }
};