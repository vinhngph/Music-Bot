const { SlashCommandBuilder, StringSelectMenuOptionBuilder, StringSelectMenuBuilder, ActionRowBuilder } = require("discord.js");
const { useMainPlayer, QueryType } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Let's enjoy music")
        .addStringOption(option => option.setName("search").setDescription("Enter the name or link of the music you want to listen to").setRequired(true)),
    async execute(interaction) {
        const checkResponse = await interaction.deferReply({ ephemeral: true });

        const player = useMainPlayer();
        const query = await interaction.options.get("search").value;

        const result = await player.search(query, {
            searchEngine: QueryType.APPLE_MUSIC_SEARCH,
            requestedBy: interaction.member
        });

        if (!result) {
            return interaction.followUp({ content: `Your search did not match any results.`, ephemeral: true });
        }
        const allTracks = result.tracks.slice(0, 10);

        const options = allTracks.map((track) => {
            let url = track.url;
            url = url.replace(/^https:\/\//, '');

            const option = new StringSelectMenuOptionBuilder()
                .setLabel(track.title)
                .setValue(url)
                .setDescription(`${track.author} • ${track.duration}`)
            return option;
        });

        const select = new StringSelectMenuBuilder()
            .setCustomId('search-menu')
            .setPlaceholder(`🔎 [ ${query} ]`)
            .addOptions(options)

        const actionRow = new ActionRowBuilder().addComponents(select);

        const response = await interaction.followUp({
            components: [actionRow],
            ephemeral: true
        });

        const collectorFilter = i => i.user.id === interaction.user.id
        try {
            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
            if (confirmation.customId === 'search-menu') {
                return checkResponse.delete();
            }
        } catch (error) {
            return interaction.editReply({ content: `You have not chosen anything.`, ephemeral: true, components: [] });
        }
    }
}