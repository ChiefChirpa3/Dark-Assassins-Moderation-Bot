const Discord = require('discord.js');
require('discord-reply');
const client = new Discord.Client();
const ms = require('ms');

module.exports = {
    name: "giveaway",
    description: 'Starts a giveaway (STAFF ONLY)',
    aliases: ['gw'],
    async execute(message, args) {
        if (!message.member.hasPermission("ADMINISTRATOR"))
            return message.channel.send('Insuffienct Permissions');
        let sponser = args[1];
        let numWinners = args[2];
        let prize = args.slice(4).join(' ');
        let time = args[3];

        const giveawayEmoji = '🎉';

        const giveawayStart = new Discord.MessageEmbed()
            .setTitle(`${prize}!`)
            .setDescription(`Click :tada: below to enter!

            Created By: <@${message.author.id}>
            Sponsered By: ${sponser}
            Winners: ${numWinners}`)
            .setFooter(`${time} seconds`)
            .setColor('3fb53f');
        
        const targetChannel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);

        let messageEmbed = await targetChannel.send(`<@&862781557553889290>`, giveawayStart);

        messageEmbed.react(giveawayEmoji);
        
        setTimeout(async function() {
            let posWinners = await messageEmbed.reactions.cache.get(giveawayEmoji).users.cache.random(numWinners);;
            if (messageEmbed.reactions.cache.get(giveawayEmoji).users.cache.bot) {
                console.log('bruh')
            }

            const giveawayEnd = new Discord.MessageEmbed()
                .setTitle('Congratulations!')
                .setDescription(`Congratulations ${posWinners}, you won ${prize}
                
                `)
                .setFooter(`You have 24 hours to claim: ${prize}. DM ${message.author.username}`)
                .setColor('3fb53f');

            console.log(posWinners);

            messageEmbed.lineReplyNoMention(`${posWinners}`, giveawayEnd);

            const EndGiveaway = new Discord.MessageEmbed()
                .setTitle(`${prize} [ENDED]`)
                .setDescription(`Click :tada: below to enter!

                Winners: ${posWinners}
                Created By: <@${message.author.id}>
                Sponsered By: ${sponser}`)
                .setFooter(`This giveaway has ended.`)
                .setColor('3fb53f');

            messageEmbed.edit(EndGiveaway)
        }, ms(time));
    }
}