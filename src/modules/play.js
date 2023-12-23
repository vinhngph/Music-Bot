async function play(interaction, query, typePlay) {
    const { StringSelectMenuOptionBuilder, StringSelectMenuBuilder, ActionRowBuilder } = require("discord.js");
    const { useMainPlayer, QueryType } = require('discord-player');
    const validURL = require('valid-url');

    const checkLength = input => {
        const length = 40;
        if (input.length <= length) return input;

        return input.substring(0, length - 3) + "...";
    }

    const getEngine = (client, guildId) => {
        let engine = client.engine.get(guildId);
        if (!engine) {
            client.engine.set(guildId, 'spotify');
        }
        return client.engine.get(guildId);
    }

    const url = (url, engine) => {
        const enginePatterns = {
            'apple_music': /^https:\/\/music\.apple\.com\//,
            'spotify': /^https:\/\/open\.spotify\.com\//,
            'soundcloud': /^https:\/\/soundcloud\.com\//,
            'youtube': /^https:\/\/www\.youtube\.com\//,
        };

        const pattern = enginePatterns[engine] || /^https?:\/\//; 
        return url.replace(pattern, '');
    };

    const scEngine = engine => {
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

    const checkResponse = await interaction.deferReply({ ephemeral: true });

    const player = useMainPlayer();
    const client = await interaction.client;
    const guildId = await interaction.guildId;

    const engine = getEngine(client, guildId);

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

    let result;
    try {
        result = await player.search(query, {
            searchEngine: scEngine(engine),
            requestedBy: interaction.member
        });
    } catch (error) {
        return interaction.editReply({ content: `Your search did not match any results.`, ephemeral: true });
    }

    const allTracks = result.tracks.slice(0, 10);
    const options = allTracks.map((track) => {
        if (track.url.length > 100) {
            return null; 
        }

        const option = new StringSelectMenuOptionBuilder()
            .setLabel(track.title)
            .setValue(url(track.url, engine))
            .setDescription(`${checkLength(track.author)} • ${track.duration}`)
        return option;
    }).filter(option => option !== null);

    const select = new StringSelectMenuBuilder()
        .setCustomId(`${typePlay}`)
        .setPlaceholder(`🔎 | ${query} |`)
        .addOptions(options)

    const actionRow = new ActionRowBuilder().addComponents(select);

    const response = await interaction.editReply({
        components: [actionRow],
        ephemeral: true
    });

    const collectorFilter = i => i.user.id === interaction.user.id
    try {
        const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
        if (confirmation.customId === `${typePlay}`) {
            return checkResponse.delete();
        }
    } catch (error) {
        return interaction.editReply({ content: `You have not chosen anything.`, ephemeral: true, components: [] });
    }
}

module.exports = {
    play
}