const fs = require('fs');
const Discord = require('discord.js');
require("dotenv").config();
const client = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION" ]});
require('discord-buttons')(client);
client.commands = new Discord.Collection();
const mongoose = require('mongoose');

process.title = 'DA Bot';

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const commandFolders = fs.readdirSync('./commands');


client.on('ready', () => {
	console.log('Ready');
	const guild = client.guilds.cache.get('808847985580048436');
	client.user.setPresence({
		status: 'dnd',
		activity: {
			name: `${guild.memberCount} members in the Dark Assassins Discord`,
			type: 'WATCHING'
		}
	})
});

client.on('guildMemberAdd', guildMember => {
	var msg = "`h!u <username>`"
	const welcomeEmbed = new Discord.MessageEmbed()
		.setTitle('Welcome to Dark Assasins!')
		.setDescription(`Hi <@${guildMember.user.id}>! Please run ${msg} in <#844280749033127978> to get started.`)
		.setFooter('Enjoy your stay!')
		//.setImage(guildMember.user.avatarURL())
	
	guildMember.guild.channels.cache.get('810707319192420362').send(`<@${guildMember.user.id}>!`);
	guildMember.guild.channels.cache.get('810707319192420362').send(welcomeEmbed);
	
	//guildMember.guild.channels.cache.get('810707319192420362').send(`Welcome to **Dark Assasins** <@${guildMember.user.id}>! Make sure to read the rules in <#808848103918141450>. Don't forget to verify in <#844280749033127978> with ${msg}! Enjoy your stay.`);
});


client.on('guildMemberRemove', guildMember => {
	const leaveEmbed = new Discord.MessageEmbed()
		.setTitle(`${guildMember.user.username} left Dark Assassins. :regional_indicator_l:`)
		.setDescription('Hope they enjoyed their stay.')
	guildMember.guild.channels.cache.get('810707319192420362').send(leaveEmbed);
})


for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}


client.on('message', message => {
	if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) return;

	const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command)
		return;

	try {
		client.commands.get(commandName).execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

mongoose.connect(process.env.MONGODB_SRV, {
	useNewUrlParser : true,
	useUnifiedTopology : true,
	userFindandModify: false,
}).then(() => {
	console.log('Connected to database');
}).catch((err) => {
	console.loog(err);
});

client.login(process.env.DISCORD_TOKEN);