const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Let's enjoy music")
        .addStringOption(option => option.setName("search").setDescription("Enter the name or link of the music you want to listen to").setRequired(true)),
    async execute(interaction) {
        const query = await interaction.options.get("search").value;
        const client = interaction.client;

        try {
            return client.play(interaction, query, 'search-menu');
            
        } catch (error) {
            console.error(error);            
        }
    }
}