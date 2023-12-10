const { Client, GatewayIntentBits, ChannelType, EmbedBuilder, Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/User');
const { token, clientId, guildId, mongoURI, CHANNEL_ID, CHANNEL_ID2, REACTION_ROLE_ID, REACTION_ROLE_ID_1, REACTION_ROLE_ID_2, KICK_PROBABILITY } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));


client.once('ready', async () => {
    console.log(`Bot is online as ${client.user.tag}`);

    const rest = new REST({ version: '9' }).setToken(token);

    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: client.commands.map(command => command.data.toJSON()) },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
});
client.on('ready', async () => {
    const channel = await client.channels.fetch(CHANNEL_ID).catch(console.error);
    if (channel && channel.type === ChannelType.GuildText) {
        const messages = await channel.messages.fetch({ limit: 10 });
        const alreadySent = messages.some(message => message.embeds.some(embed => embed.title === '🔥 Pyrotechnics World 🔥'));

        let squareMessage;

        if (!alreadySent) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('🔥 Pyrotechnics World 🔥')
                .setDescription('React to get into the pyrotechnics world!');
            const squareMessage = await channel.send({ embeds: [embed] });
            squareMessage.react('🔥');
        } else {
            squareMessage = messages.find(message => message.embeds.some(embed => embed.title === '🔥 Pyrotechnics World 🔥'));
        }

        if (squareMessage) {
            const filter = (reaction, user) => reaction.emoji.name === '🔥' && !user.bot;
            const collector = squareMessage.createReactionCollector(filter);
            collector.on('collect', async (reaction, user) => {
                console.log(`Collected reaction from ${user.tag}`);

                const member = await channel.guild.members.fetch(user.id).catch(console.error);
                if (!member) {
                    console.log('Member not found');
                    return;
                }

                try {
                    await member.roles.add(REACTION_ROLE_ID);
                    console.log(`Added role to ${member.user.tag}`);
                    await member.roles.add(REACTION_ROLE_ID);
                    let userRecord = await User.findOne({ discordId: user.id });
                    if (!userRecord) {
                        userRecord = new User({ discordId: user.id, xp: 0, roles: [REACTION_ROLE_ID] });
                    } else if (!userRecord.roles.includes(REACTION_ROLE_ID)) {
                        userRecord.roles.push(REACTION_ROLE_ID);
                    }
                    await userRecord.save();
                } catch (error) {
                    console.error('Error adding role:', error);
                }
            });
        }
    } else {
        console.error(`No se encontró el canal con ID ${CHANNEL_ID}`);
    }
});

client.on('messageCreate', async (message) => {
    try {
        console.log(`Message received: ${message.content}`);
        if (message.author.bot || message.channel.id !== CHANNEL_ID2) {
            return;
        }
        console.log(`Processing message from ${message.author.tag}`);

        let user = await User.findOne({ discordId: message.author.id });
        if (!user) {
            user = new User({ discordId: message.author.id, xp: 0, roles: [] });
            await user.save();
            console.log(`New user created: ${message.author.tag}`);
        }

        const pointsEarned = Math.floor(Math.random() * 10) + 1;
        user.xp += pointsEarned;
        await user.save();
        // console.log(`Added ${pointsEarned} points to ${message.author.tag}`);
        // message.reply(`You earned ${pointsEarned} points!`);

        if (Math.random() < KICK_PROBABILITY) {
            const member = await message.guild.members.fetch(message.author.id);
            const isServerOwner = member.id === message.guild.ownerId;
            const MODERATOR_ROLE_ID = "888540805269180488";
            const isMod = member.roles.cache.some(role => role.id === MODERATOR_ROLE_ID);

            if (!isServerOwner && !isMod) {
                await member.kick('You were kicked for being unlucky');
                const kickEmbed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle(`🔥🔥 ${message.author.toString()} HAVE BEEN BURNED 🔥🔥.`);
                await message.channel.send({ embeds: [kickEmbed] });
            } else {
                message.channel.send(`${message.author.toString()}, you are protected as Modo/Owner.`);
            }
            return;
        }

        if (user.roles.includes(REACTION_ROLE_ID_1) && Math.random() < 0.005) {
            const role2 = message.guild.roles.cache.get(REACTION_ROLE_ID_2);
            if (role2) {
                await message.guild.members.cache.get(message.author.id).roles.add(REACTION_ROLE_ID_2);
                user.roles.push(REACTION_ROLE_ID_2);
                await user.save();
                const ogRoleEmbed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle(`🔥🔥 Congrats ${message.author.toString()} you got the OG Role 🔥🔥`)
                    .setImage('https://media.giphy.com/media/ZxomYqy9uGtSQSSjth/giphy.gif');
                await message.channel.send({ embeds: [ogRoleEmbed] });
            }
        }
    } catch (error) {
        console.error('Error processing message:', error);
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
    }
});

client.login(token);
