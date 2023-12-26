const { StringSelectMenuOptionBuilder, StringSelectMenuBuilder, ActionRowBuilder } = require("discord.js");
const validURL = require('valid-url');
const { useMainPlayer, useQueue } = require('discord-player');

async function play(interaction, query, typePlay) {
    const checkResponse = await interaction.deferReply({ ephemeral: true });
    const player = useMainPlayer();

    //direct play if this query is a url
    if (validURL.isUri(query)) {
        //checking the duration 
        const check = await player.search(query);
        if (check.tracks[0].durationMS > 10800000) {
            return interaction.editReply({ content: 'This music link is over 3 hours.', ephemeral: true });
        }

        //main play engine
        try {
            if (typePlay !== 'insert-menu') {
                await player.play(interaction.member.voice.channel, query, {
                    nodeOptions: {
                        metadata: interaction,
                        disableFilterer: true,
                        defaultFFmpegFilters: false,
                        volume: 50
                    }
                });
            } else {
                const result = await player.search(query);
                const queue = useQueue(interaction.guildId);
                queue.insertTrack(result.tracks[0], 0);
            }
        } catch (error) {
            return interaction.editReply({ content: 'This music link is not supported.', ephemeral: true });
        } finally {
            return checkResponse.delete();
        }
    }

    const client = interaction.client;
    const guildId = interaction.guildId;
    const bot = client.bot;
    const engine = bot.getEngine(client, guildId);

    let result;
    try {
        result = await player.search(query, {
            searchEngine: bot.searchEngine(engine),
            requestedBy: interaction.member
        })
    } catch (error) {
        return interaction.editReply({ content: `Your search did not match any results.`, ephemeral: true });
    }

    const options = result.tracks.slice(0, 10).map((track) => {
        const url = track.url;
        if (url.length > 100) {
            return null;
        }

        const option = new StringSelectMenuOptionBuilder()
            .setLabel(bot.shortString(track.title))
            .setValue(bot.shortUrl(url, engine))
            .setDescription(`${bot.shortString(track.author)} • ${track.duration}`)
        return option;
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