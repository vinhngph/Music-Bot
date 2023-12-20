const { SlashCommandBuilder } = require("discord.js");
const { useMainPlayer } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Let's enjoy music")
        .addStringOption(option => option.setName("search").setDescription("Enter the name or link of the music you want to listen to").setRequired(true)),
    async execute(interaction, message) {
        const player = useMainPlayer();
        const query = await interaction.options.get("search").value;

        player.play(interaction.member.voice.channel, query, {
            nodeOptions: {
                metadata: interaction
            }
        });
    }
}