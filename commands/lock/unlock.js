const Discord = require('discord.js');

module.exports = {
    name: "unlock",
    description: "Unlocks a channel (STAFF ONLY)",
    execute(message, args) {
        if (!message.member.hasPermission("ADMINISTRATOR"))
            return message.channel.send('Insuffienct Permissions');
        if (!message.guild.me.hasPermission("MANAGE_CHANNELS"))
            return message.channel.send("I don't have 'MANAGE_CHANNELS'");
        const role = message.guild.roles.cache.get('808854572893208576');
        let lockChannel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
        let reason = args.slice(1).join(' ');
        let user = message.author.username;
        if (!lockChannel)
            lockChannel = message.channel;
        if (!reason)
            reason = `No reason specified`;
        lockChannel.updateOverwrite(role,{
            SEND_MESSAGES: true
        }).catch(err => console.log(err));


        const lockEmbed = new Discord.MessageEmbed()
            .setTitle('Channel Unlocked')
            .setDescription(`
                This Channel Was Unlocked with Reason: **${reason}**.
            `)
            .setFooter(`Unlocked by: ${user}`)
            .setColor('#00FF00')
        
        lockChannel.send(lockEmbed);
        message.channel.send(`${lockChannel} is now unlocked`)
    }
}