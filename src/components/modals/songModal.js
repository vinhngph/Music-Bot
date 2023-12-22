const { StringSelectMenuOptionBuilder, StringSelectMenuBuilder, ActionRowBuilder } = require("discord.js");
const { useMainPlayer, QueryType } = require('discord-player');
const validURL = require('valid-url');

module.exports = {
    data: {
        name: `songModal`
    },
    async execute(interaction) {
        const checkResponse = await interaction.deferReply({ ephemeral: true });

        const player = useMainPlayer();
        const client = await interaction.client;
        const guildId = await interaction.guildId;

        const data = await interaction.fields.getTextInputValue('songData');
        const query = data.toString();

        if (validURL.isUri(query)) {
            try {
                await player.play(interaction.member.voice.channel, query, {
                    nodeOptions: {
                        metadata: interaction,
                        disableFilterer: true,
                        defaultFFmpegFilters: false,
                        volume: 50
                    }
                });
                return checkResponse.delete();
            } catch (error) {
                return interaction.editReply({ content: 'This music link is not supported.', ephemeral: true });
            }
        }

        let engine = await client.engine.get(guildId);
        if (!engine) {
            await client.engine.set(guildId, 'spotify');
        }
        engine = await client.engine.get(guildId);

        const sEngine = engine => {
            if (engine === 'apple_music') {
                return QueryType.APPLE_MUSIC_SEARCH;
            }
            if (engine === 'spotify') {
                return QueryType.SPOTIFY_SEARCH;
            }
            if (engine === 'soundcloud') {
                return QueryType.SOUNDCLOUD_SEARCH;
            }
            if (engine === 'youtube') {
                return QueryType.YOUTUBE_SEARCH;
            }
        }

        const result = await player.search(query, {
            searchEngine: sEngine(engine),
            requestedBy: interaction.member
        });

        if (!result) {
            return interaction.editReply({ content: `Your search did not match any results.`, ephemeral: true });
        }

        const allTracks = result.tracks.slice(0, 10);
        const options = allTracks.map((track) => {
            if (track.url.length > 100) {
                return interaction.editReply({ content: `Your search did not match any results.`, ephemeral: true });
            }

            const option = new StringSelectMenuOptionBuilder()
                .setLabel(track.title)
                .setValue(track.url)
                .setDescription(`${track.author} • ${track.duration}`)
            return option;
        });

        const select = new StringSelectMenuBuilder()
            .setCustomId('search-menu')
            .setPlaceholder(`🔎 [ ${query} ]`)
            .addOptions(options)

        const actionRow = new ActionRowBuilder().addComponents(select);

        const response = await interaction.editReply({
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