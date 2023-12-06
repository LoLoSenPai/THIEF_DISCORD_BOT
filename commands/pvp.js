const { SlashCommandBuilder } = require('discord.js');
const User = require('../models/User');
const { PVP_WIN_PROBABILITY, REACTION_ROLE_ID_1 } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pvp')
        .setDescription('Start a PVP battle.'),
    async execute(interaction) {
        const user = await User.findOne({ discordId: interaction.user.id });
        if (!user || user.xp < 250) {
            await interaction.reply('You don\'t have enough XP to initiate a battle.');
            return;
        }
        const otherWlMember = (await User.find({
            roles: REACTION_ROLE_ID_1,
            discordId: { $ne: interaction.user.id },
            xp: { $lt: user.xp }
        })).sort(() => Math.random() - 0.5)[0];

        if (!otherWlMember) {
            await interaction.reply('There are no opponents available.');
            return;
        }

        const isWin = Math.random() < PVP_WIN_PROBABILITY;
        user.xp -= 250;
        if (isWin) {
            user.roles.push(REACTION_ROLE_ID_1);
            await User.findOneAndUpdate({ discordId: otherWlMember.discordId }, { $pull: { roles: REACTION_ROLE_ID_1 } });
            await interaction.reply('YOU WON THE WL ROLE, CONGRATS!');
        } else {
            await interaction.reply('YOU LOSE :(');
        }
        await user.save();
    },
};
