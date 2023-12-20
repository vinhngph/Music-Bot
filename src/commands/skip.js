const { SlashCommandBuilder } = require("discord.js");
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skip"),
    async execute(interaction) {
        const queue = useQueue(interaction.guildId);

        queue.node.skip();
    }
}