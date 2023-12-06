const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Show your profile.'),
    async execute(interaction) {
        const userProfile = await User.findOne({ discordId: interaction.user.id });
        if (!userProfile) {
            await interaction.reply('Profile not found.');
            return;
        }

        const profileEmbed = new EmbedBuilder()
            .setColor('#FFD700')
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
            .setDescription(`XP: ${userProfile.xp}\nRoles: ${userProfile.roles.join(', ')}`)
            .setTitle('🔥 Profile 🔥');

        await interaction.reply({ embeds: [profileEmbed] });
    },
};
