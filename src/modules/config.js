const { ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const musicPlaying = `<a:music:1130466218239873087>`;
const waitThumbnail = "https://cdn.discordapp.com/attachments/1128652851636351097/1187989818207117332/ad0f64da6fcca534.png?ex=6598e4bc&is=65866fbc&hm=043f0a31247ca115373d394c6adf78484c3448cdf435d0775445fec282fea2e3&";
const colorEmbed = '#2b2d31';
const taskbarEmpty = 'https://cdn.discordapp.com/attachments/1128652851636351097/1188014035002732554/empty.png?ex=6598fb4a&is=6586864a&hm=05c72b21763877160cb12012762a3ba7d7d751953fbcd5eedd581952704a8c50&';

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
    let taskbar;
    switch (track.source) {
        case 'apple_music':
            taskbar = "https://cdn.discordapp.com/attachments/1128652851636351097/1188011792916549662/apple_music.png?ex=6598f933&is=65868433&hm=dd2230b2d8688c971403ab3ad3000760de9f1b45cb6891681781a53aa0e0fd1b&";
            break;

        case 'spotify':
            taskbar = "https://cdn.discordapp.com/attachments/1128652851636351097/1188011827238539335/spotify.png?ex=6598f93b&is=6586843b&hm=60724c3c5c0d18efb6c7e2628617644e2bdaa524765c8315d48c4282f56e40cf&";
            break;

        case 'soundcloud':
            taskbar = "https://cdn.discordapp.com/attachments/1128652851636351097/1188045855538810900/soundcloud.png?ex=659918ec&is=6586a3ec&hm=555ab6a9df3d95ca5f4e1ba8b8662f6cd2c771046294247309f953e65255d453&";
            break;

        case 'youtube':
            taskbar = "https://cdn.discordapp.com/attachments/1128652851636351097/1188011852278546432/youtube.png?ex=6598f941&is=65868441&hm=243ee22baae0a5068d00a7f626cc8acea8b6bbf2fa66de8967adbb50e79c3e6d&";
            break;
        default:
            break;
    }

    const embed = new EmbedBuilder()
        .setColor(colorEmbed)
        .setTitle(`**${track.title}**`)
        .setURL(track.url)
        .setDescription(`${track.duration}\n\n**${track.author}**`)
        .setThumbnail(track.thumbnail)
        .setImage(taskbar)
    return embed;
}

function basicButtons(queue) {
    const tracks = queue.tracks.toArray();
    const mode = queue.repeatMode;

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
        .setDisabled(!(mode === 3 || tracks[0] ? true : false))

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
    const mode = queue.repeatMode;

    const loopSt = () => {
        if (mode === 0 || mode === 3) {
            return '🔁';
        } else if (mode === 1) {
            return '🔂';
        } else if (mode === 2) {
            return '🔁';
        }
    }

    const autoplaySt = () => {
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
        .setDisabled(!(mode === 3 || tracks[0] ? true : false))

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
        .setLabel(`${loopSt()}`)
        .setStyle((mode === 3 || mode === 0) ? ButtonStyle.Secondary : ButtonStyle.Success)
        .setDisabled(false)

    buttons[7] = new ButtonBuilder()
        .setCustomId('autoplay')
        .setLabel(`${autoplaySt()}`)
        .setStyle(mode === 3 ? ButtonStyle.Success : ButtonStyle.Secondary)
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
            .setDescription(`N/A\n\n**N/A**`)
            .setThumbnail(waitThumbnail)
            .setImage(taskbarEmpty)
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

            try {
                for (const msg of allMess.values()) {
                    await msg.delete()
                };
            } catch (error) {
                console.error(error);
            } finally {
                return channel.send({ embeds: embed, components: getButtons });
            }
        }
    } else {
        const scanAll = await channel.messages.fetch();
        const allMess = scanAll.filter((msg) => msg.author.bot && msg.author.id === client.user.id);

        try {
            for (const msg of allMess.values()) {
                await msg.delete()
            };
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