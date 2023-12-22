const { SlashCommandBuilder } = require("discord.js");
const type = require('../modules/type.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("change")
        .setDescription("Select the engine that you want to use")
        .addStringOption(option =>
            option.setName("engine")
                .setDescription("List of engines")
                .setRequired(true)
                .addChoices(
                    { name: "Apple Music", value: "apple_music" },
                    { name: "Spotify", value: "spotify" },
                    { name: "Soundcloud", value: "soundcloud" },
                    { name: "Youtube", value: "youtube" }
                )),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const choice = await interaction.options.getString("engine");

        const client = await interaction.client;
        const guildId = await interaction.guildId;

        await client.engine.set(guildId, choice);

        return interaction.followUp({ content: `Changed to **${type.toCamelCase(choice)}**` });
    }
}