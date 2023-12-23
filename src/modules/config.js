const { ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const musicPlaying = `<a:music:1130466218239873087>`;
const waitThumbnail = "https://cdn.discordapp.com/attachments/1128652851636351097/1187989818207117332/ad0f64da6fcca534.png?ex=6598e4bc&is=65866fbc&hm=043f0a31247ca115373d394c6adf78484c3448cdf435d0775445fec282fea2e3&";
const spotify = "https://cdn.discordapp.com/attachments/1128652851636351097/1187998488932384828/spotify.png?ex=6598eccf&is=658677cf&hm=50427d4385a767791e395ec36872cc056b427a5a98d2ef5041373d60ac85ac41&"
const colorEmbed = '#2b2d31';

function queueList(queue) {
    const tracks = queue.tracks.toArray();
    const list = tracks.slice(0, 10).map((track, idx) => `${idx + 1} • ${track.title}`).join('\n');

    let embed;
    if (tracks[11]) {
        embed = new EmbedBuilder()
            .setColor(colorEmbed)
            .setTitle(`**Upcoming songs •** ${musicPlaying}`)
            .setDescription(list)
            .setFooter({ text: '•••' })
    }
    else {
        embed = new EmbedBuilder()
            .setColor(colorEmbed)
            .setTitle(`**Upcoming songs •** ${musicPlaying}`)
            .setDescription(list)
    }
    return embed;
}

function media(track) {
    const toCamelCase = inputString => {
        let words = inputString.split('_');

        let camelCaseString = words
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');

        return camelCaseString;
    };

    const embed = new EmbedBuilder()
        .setColor(colorEmbed)
        .setTitle(`**${track.title}**`)
        .setURL(track.url)
        .addFields(
            { name: 'Author', value: `${track.author}`, inline: true },
            { name: 'Duration', value: `${track.duration}`, inline: true }
        )
        .setThumbnail(track.thumbnail)
        .setImage(spotify)
    return embed;
}

function basicButtons(queue) {
    const tracks = queue.tracks.toArray();

    let buttons = []
    buttons[0] = new ButtonBuilder()
        .setCustomId('extend')
        .setLabel('▽')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(!queue.connection)

    buttons[1] = new ButtonBuilder()
        .setCustomId('previous')
        .setLabel('◁')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(!queue.history.previousTrack ? true : false)

    buttons[2] = new ButtonBuilder()
        .setCustomId('pause-resume')
        .setLabel(queue.node.isPaused() ? '▶' : '❚❚')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(!queue.connection)

    buttons[3] = new ButtonBuilder()
        .setCustomId('skip')
        .setLabel('▷')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(!tracks[0])

    buttons[4] = new ButtonBuilder()
        .setCustomId('addSong')
        .setLabel('♫')
        .setStyle(ButtonStyle.Secondary)

    return [
        {
            type: 1,
            components: [buttons[0], buttons[1], buttons[2], buttons[3], buttons[4]]
        }
    ]
}

function moreButtons(queue) {
    const tracks = queue.tracks.toArray();
    const checkMode = queue.repeatMode;

    const loopSt = (queue) => {
        const mode = queue.repeatMode;

        if (mode === 0 || mode === 3) {
            return '⟳';
        } else if (mode === 1) {
            return '⥬';
        } else if (mode === 2) {
            return '⇌';
        }
    }

    const autoplaySt = (queue) => {
        const mode = queue.repeatMode;

        if (mode === 3) {
            return '♾️';
        } else {
            return '∞';
        }
    }

    let buttons = []
    buttons[0] = new ButtonBuilder()
        .setCustomId('extend')
        .setLabel('▼')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(!queue.connection)

    buttons[1] = new ButtonBuilder()
        .setCustomId('previous')
        .setLabel('◁')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(!queue.history.previousTrack ? true : false)

    buttons[2] = new ButtonBuilder()
        .setCustomId('pause-resume')
        .setLabel(queue.node.isPaused() ? '▶' : '❚❚')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(!queue.connection)

    buttons[3] = new ButtonBuilder()
        .setCustomId('skip')
        .setLabel('▷')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(!(checkMode === 3 || tracks[0] ? true : false))

    buttons[4] = new ButtonBuilder()
        .setCustomId('addSong')
        .setLabel('♫')
        .setStyle(ButtonStyle.Secondary)

    buttons[5] = new ButtonBuilder()
        .setCustomId('delete')
        .setLabel(`⊘`)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(!queue.connection)

    buttons[6] = new ButtonBuilder()
        .setCustomId('loop')
        .setLabel(`${loopSt(queue)}`)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false)

    buttons[7] = new ButtonBuilder()
        .setCustomId('autoplay')
        .setLabel(`${autoplaySt(queue)}`)
        .setStyle(checkMode === 3 ? ButtonStyle.Success : ButtonStyle.Secondary)
        .setDisabled(false)

    buttons[8] = new ButtonBuilder()
        .setCustomId('shuffle')
        .setLabel('🔀')
        .setStyle(queue.isShuffling ? ButtonStyle.Success : ButtonStyle.Secondary)
        .setDisabled(tracks[1] ? false : true)

    buttons[9] = new ButtonBuilder()
        .setCustomId('insertTrack')
        .setLabel('⇪')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false)

    return [
        {
            type: 1,
            components: [buttons[0], buttons[1], buttons[2], buttons[3], buttons[4]]
        },
        {
            type: 1,
            components: [buttons[5], buttons[6], buttons[7], buttons[8], buttons[9]]
        }
    ]
}

function sendButtons(queue, status) {
    if (!status) {
        const buttons = basicButtons(queue);
        return buttons;
    }
    else {
        const buttons = moreButtons(queue);
        return buttons;
    }
}

function sendEmbeds(queue, track) {
    const embed = media(track, queue);
    const tracks = queue.tracks.toArray();

    if (tracks[0]) {
        const list = queueList(queue);
        return [list, embed];
    }
    else {
        return [embed];
    }
}

async function sendMessage(queue, track) {
    const client = queue.metadata.client;
    const channel = queue.metadata.channel;

    const guildId = queue.metadata.guildId;

    const status = client.stButtons.get(guildId);

    let embed;
    if (!track) {
        const waitEmbed = new EmbedBuilder()
            .setColor(colorEmbed)
            .setTitle(`**EMPTY PLAYLIST**`)
            .setImage(waitThumbnail)
        embed = [waitEmbed]
    } else {
        embed = sendEmbeds(queue, track);
    }

    const getButtons = sendButtons(queue, status);

    const scan = await channel.messages.fetch({ limit: 5 });
    const curMess = scan.first();

    if (!curMess) {
        return channel.send({ embeds: embed, components: getButtons });
    }

    if (curMess.author.id === client.user.id) {
        const botMessages = scan.filter((msg) => msg.author.bot && msg.author.id === client.user.id);

        if (botMessages.size === 1) {
            const botMess = botMessages.first();
            return botMess.edit({ embeds: embed, components: getButtons });
        }

        if (botMessages.size > 1) {
            const scanAll = await channel.messages.fetch();
            const allMess = scanAll.filter((msg) => msg.author.bot && msg.author.id === client.user.id);
            const oldMess = allMess.map((msg) => msg.id);

            try {
                await channel.bulkDelete(oldMess);
            } catch (error) {
                console.error(error);
            } finally {
                return channel.send({ embeds: embed, components: getButtons });
            }
        }
    } else {
        const scanAll = await channel.messages.fetch();
        const allMess = scanAll.filter((msg) => msg.author.bot && msg.author.id === client.user.id);
        const oldMess = allMess.map((msg) => msg.id);

        try {
            await channel.bulkDelete(oldMess);
        } catch (error) {
            console.error(error);
        } finally {
            return channel.send({ embeds: embed, components: getButtons });
        }
    }
}

module.exports = {
    queueList,
    media,
    basicButtons,
    moreButtons,
    sendButtons,
    sendEmbeds,
    sendMessage
}