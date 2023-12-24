async function play(interaction, query, typePlay) {
    const checkResponse = await interaction.deferReply({ ephemeral: true });

    const validURL = require('valid-url');

    const { useMainPlayer } = require('discord-player');
    const player = useMainPlayer();

    if (validURL.isUri(query)) {
        try {
            if (typePlay !== 'insert-menu') {
                player.play(interaction.member.voice.channel, query, {
                    nodeOptions: {
                        metadata: interaction,
                        disableFilterer: true,
                        defaultFFmpegFilters: false,
                        volume: 50
                    }
                });
            } else {
                const result = await player.search(query);
                const { useQueue } = require('discord-player');
                const queue = useQueue(interaction.guildId);
                queue.insertTrack(result.tracks[0], 0);
            }
        } catch (error) {
            return interaction.editReply({ content: 'This music link is not supported.', ephemeral: true });
        } finally {
            return checkResponse.delete();
        }
    }

    const { StringSelectMenuOptionBuilder, StringSelectMenuBuilder, ActionRowBuilder } = require("discord.js");

    const client = interaction.client;
    const guildId = interaction.guildId;
    const engine = require('./functions/getEngine').getEngine(client, guildId);

    let result;
    try {
        result = await player.search(query, {
            searchEngine: require('./functions/searchEngine').searchEngine(engine),
            requestedBy: interaction.member
        });
    } catch (error) {
        return interaction.editReply({ content: `Your search did not match any results.`, ephemeral: true });
    }

    const short = require('./functions/shortString');

    const options = result.tracks.slice(0, 10).map((track) => {
        const url = track.url;
        if (url.length > 100) {
            return null;
        }

        const option = new StringSelectMenuOptionBuilder()
            .setLabel(track.title)
            .setValue(require('./functions/shortUrl').shortUrl(url, engine))
            .setDescription(`${short.shortString(track.author)} • ${track.duration}`)
        return option;
    }).filter(option => option !== null);

    const select = new StringSelectMenuBuilder()
        .setCustomId(`${typePlay}`)
        .setPlaceholder(`🔎 | ${short.shortString(query)} |`)
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