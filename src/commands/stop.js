const { SlashCommandBuilder } = require("discord.js");
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("stop"),
    async execute(interaction) {
        const queue = useQueue(interaction.guildId);

        queue.delete();
    }
}