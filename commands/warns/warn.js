const db = require('../../models/warns');

const { Message, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'warn',
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
            
            if (!data) {
                data = new db({
                    guildid : message.guild.id,
                    user : user.user.id,
                    content: [
                        {
                            moderator : message.author.id,
                            reason : reason
                        }
                    ]
                });
            }
            else {
                const obj = {
                    moderator : message.author.id,
                    reason : reason
                }
                data.content.push(obj);
            }
            data.save();
        });
        user.send(new MessageEmbed()
            .setTitle('You were warned')
            .setDescription(`You were warned in **${message.guild.name}**`)
            .addFields(
                {
                    name : 'Moderator',
                    value : message.author.tag
                },
                {
                    name : 'Reason',
                    value : reason
                },
            )
            .setColor('RED')
        );
        lastSendMessage.lineReplyNoMention(new MessageEmbed()
            .setDescription(`\`${user.user.tag} has been warned. Check DMS for more information\``)
            .setColor('BLUE')
        );
    }
};