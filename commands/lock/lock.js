const Discord = require('discord.js');

module.exports = {
    name: "lock",
    description: 'Locks a channel (STAFF ONLY)',
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
        lockChannel.updateOverwrite(role, {
            SEND_MESSAGES: false
        }).catch(err => console.log(err));


        const lockEmbed = new Discord.MessageEmbed()
            .setTitle('Channel Locked')
            .setDescription(`
                This Channel Was Locked with Reason: **${reason}**.
            `)
            .setFooter(`Locked by: ${user}`)
            .setColor('#FF0000')
        
        lockChannel.send(lockEmbed);
        message.channel.send(`${lockChannel} is now locked`)
    }
}