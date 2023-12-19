const { SlashCommandBuilder } = require("discord.js");
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("stop"),
    async execute(interaction) {
        const channel = interaction.member.voice.channel;
        if (!channel) return interaction.reply('You are not connected to a voice channel!');

        const queue = useQueue(interaction.guildId);
        await interaction.deferReply();

        try {
            queue.delete();
            return interaction.followUp(`Stopped!`);
        } catch (e) {
            return interaction.followUp(`Something went wrong: ${e}`);
        }
    }
}