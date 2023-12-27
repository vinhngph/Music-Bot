const { StringSelectMenuOptionBuilder, StringSelectMenuBuilder, ActionRowBuilder } = require("discord.js");
const validURL = require('valid-url');
const { useMainPlayer, useQueue } = require('discord-player');

const MAX_DURATION = 10800000; // 3 hours in milliseconds
const COLLECTOR_TIMEOUT = 60000; // 60 seconds

async function play(interaction, query, typePlay) {
    const checkResponse = await interaction.deferReply({ ephemeral: true });
    const player = useMainPlayer();

    if (validURL.isUri(query)) {
        const result = await player.search(query);
        if (!result)
            return interaction.editReply({ content: 'This music link is not supported.', ephemeral: true });

        if (result.tracks[0].durationMS > MAX_DURATION)
            return interaction.editReply({ content: 'This music link is over 3 hours.', ephemeral: true });

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
            const queue = useQueue(interaction.guildId);
            queue.insertTrack(result.tracks[0], 0);
        }
        return checkResponse.delete();
    }

    const { client, guildId } = interaction;
    const bot = client.bot;
    const engine = bot.getEngine(client, guildId);

    const result = await player.search(query, {
        searchEngine: bot.searchEngine(engine),
        requestedBy: interaction.member
    })

    if (!result)
        return interaction.editReply({ content: 'Cannot find your search.', ephemeral: true });

    const options = result.tracks.slice(0, 10).map((track) => {
        const url = track.url;
        if (url.length > 100) {
            return null;
        }

        return new StringSelectMenuOptionBuilder()
            .setLabel(bot.shortString(track.title))
            .setValue(bot.shortUrl(url, engine))
            .setDescription(`${bot.shortString(track.author)} • ${track.duration}`)
    }).filter(option => option !== null);

    const select = new StringSelectMenuBuilder()
        .setCustomId(`${typePlay}`)
        .setPlaceholder(`🔎 | ${bot.shortString(query)}`)
        .addOptions(options)

    const actionRow = new ActionRowBuilder().addComponents(select);
    const response = await interaction.editReply({
        components: [actionRow],
        ephemeral: true
    });

    const collectorFilter = i => i.user.id === interaction.user.id;
    try {
        const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: COLLECTOR_TIMEOUT });
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