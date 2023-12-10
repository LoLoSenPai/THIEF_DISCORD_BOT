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

        const roleNames = [];
        for (const roleId of userProfile.roles) {
            const role = await interaction.guild.roles.fetch(roleId).catch(console.error);
            if (role) roleNames.push(role.name);
        }

        const profileEmbed = new EmbedBuilder()
            .setColor('#FFD700')
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
            .setDescription(`XP: ${userProfile.xp}\nRoles: ${roleNames.join(', ')}`)
            .setTitle('🔥 Profile 🔥');

        await interaction.reply({ embeds: [profileEmbed] });
    },
};
