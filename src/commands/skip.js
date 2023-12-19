const { SlashCommandBuilder } = require("discord.js");
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skip"),
    async execute(interaction) {
        const channel = interaction.member.voice.channel;
        if (!channel) return interaction.reply('You are not connected to a voice channel!');

        const queue = useQueue(interaction.guildId);
        await interaction.deferReply();

        try {
            queue.node.skip();
            return interaction.followUp(`Skipped!`);
        } catch (e) {
            return interaction.followUp(`Something went wrong: ${e}`);
        }
    }
}