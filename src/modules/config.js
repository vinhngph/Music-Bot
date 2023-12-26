const { ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const musicPlaying = `<a:music:1130466218239873087>`;
const waitThumbnail = "https://cdn.discordapp.com/attachments/1128652851636351097/1187989818207117332/ad0f64da6fcca534.png?ex=6598e4bc&is=65866fbc&hm=043f0a31247ca115373d394c6adf78484c3448cdf435d0775445fec282fea2e3&";
const colorEmbed = '#2b2d31';
const apple_music = 'https://cdn.discordapp.com/attachments/1128652851636351097/1188011792916549662/apple_music.png?ex=6598f933&is=65868433&hm=dd2230b2d8688c971403ab3ad3000760de9f1b45cb6891681781a53aa0e0fd1b&';
const spotify = 'https://cdn.discordapp.com/attachments/1128652851636351097/1188011827238539335/spotify.png?ex=6598f93b&is=6586843b&hm=60724c3c5c0d18efb6c7e2628617644e2bdaa524765c8315d48c4282f56e40cf&';
const soundcloud = 'https://cdn.discordapp.com/attachments/1128652851636351097/1188045855538810900/soundcloud.png?ex=659918ec&is=6586a3ec&hm=555ab6a9df3d95ca5f4e1ba8b8662f6cd2c771046294247309f953e65255d453&';
const youtube = 'https://cdn.discordapp.com/attachments/1128652851636351097/1188011852278546432/youtube.png?ex=6598f941&is=65868441&hm=243ee22baae0a5068d00a7f626cc8acea8b6bbf2fa66de8967adbb50e79c3e6d&';
const defaultTaskbar = 'https://cdn.discordapp.com/attachments/1128652851636351097/1188014035002732554/empty.png?ex=6598fb4a&is=6586864a&hm=05c72b21763877160cb12012762a3ba7d7d751953fbcd5eedd581952704a8c50&';

//buttons
function createButton(customId, label, style, disabled = false) {
    return new ButtonBuilder()
        .setCustomId(customId)
        .setLabel(label)
        .setStyle(style)
        .setDisabled(disabled);
}

function basicButtons(queue) {
    const tracks = queue.tracks.toArray();
    const mode = queue.repeatMode;

    const extendButton = createButton('extend', '▽', ButtonStyle.Secondary, !queue.connection);
    const previousButton = createButton('previous', '◁', ButtonStyle.Secondary, !queue.history.previousTrack);
    const pauseResumeButton = createButton('pause-resume', queue.node.isPaused() ? '▶' : '❚❚', ButtonStyle.Secondary, !queue.connection);
    const skipButton = createButton('skip', '▷', ButtonStyle.Secondary, !(mode === 3 || tracks[0]));

    const addSongButton = createButton('addSong', '♫', ButtonStyle.Secondary);

    return [
        {
            type: 1,
            components: [extendButton, previousButton, pauseResumeButton, skipButton, addSongButton]
        }
    ];
}

function moreButtons(queue) {
    const tracks = queue.tracks.toArray();
    const mode = queue.repeatMode;

    const extendButton = createButton('extend', '▼', ButtonStyle.Secondary, !queue.connection);
    const previousButton = createButton('previous', '◁', ButtonStyle.Secondary, !queue.history.previousTrack);
    const pauseResumeButton = createButton('pause-resume', queue.node.isPaused() ? '▶' : '❚❚', ButtonStyle.Secondary, !queue.connection);
    const skipButton = createButton('skip', '▷', ButtonStyle.Secondary, !(mode === 3 || tracks[0]));
    const addSongButton = createButton('addSong', '♫', ButtonStyle.Secondary);

    const deleteButton = createButton('delete', '⊘', ButtonStyle.Secondary, !queue.connection);
    const loopButton = createButton('loop', getLoopLabel(mode), (mode === 3 || mode === 0) ? ButtonStyle.Secondary : ButtonStyle.Success);
    const autoplayButton = createButton('autoplay', getAutoplayLabel(mode), mode === 3 ? ButtonStyle.Success : ButtonStyle.Secondary);
    const shuffleButton = createButton('shuffle', '🔀', queue.isShuffling ? ButtonStyle.Success : ButtonStyle.Secondary, tracks[1]);
    const insertTrackButton = createButton('insertTrack', '⇪', ButtonStyle.Secondary);

    return [
        {
            type: 1,
            components: [extendButton, previousButton, pauseResumeButton, skipButton, addSongButton]
        },
        {
            type: 1,
            components: [deleteButton, loopButton, autoplayButton, shuffleButton, insertTrackButton]
        }
    ];
}

function getLoopLabel(mode) {
    if (mode === 0 || mode === 3) {
        return '🔁';
    } else if (mode === 1) {
        return '🔂';
    } else if (mode === 2) {
        return '🔁';
    }
}

function getAutoplayLabel(mode) {
    return mode === 3 ? '♾️' : '∞';
}

function sendButtons(queue, status) {
    return status ? moreButtons(queue) : basicButtons(queue);
}


//embeds
function getQueue(tracks) {
    const embed = new EmbedBuilder()
        .setColor(colorEmbed)
        .setTitle(`**Upcoming songs •** ${musicPlaying}`)
        .setDescription(tracks.slice(0, 10).map((track, idx) => `${idx + 1} • ${track.title}`).join('\n'));

    if (tracks[11]) {
        embed.setFooter({ text: '•••' });
    }

    return embed;
}

function getMedia(track) {
    if (!track) {
        return new EmbedBuilder()
            .setColor(colorEmbed)
            .setTitle('**EMPTY PLAYLIST**')
            .setDescription('N/A\n\n**N/A**')
            .setThumbnail(waitThumbnail)
            .setImage(defaultTaskbar);
    }

    const sourceMappings = {
        'apple_music': apple_music,
        'spotify': spotify,
        'soundcloud': soundcloud,
        'youtube': youtube
    };

    const taskbar = sourceMappings[track.source] || defaultTaskbar;

    return new EmbedBuilder()
        .setColor(colorEmbed)
        .setTitle(`**${track.title}**`)
        .setURL(track.url)
        .setDescription(`${track.duration}\n\n**${track.author}**`)
        .setThumbnail(track.thumbnail)
        .setImage(taskbar);
}

function sendEmbeds(queue) {
    const embed = getMedia(queue.currentTrack);
    const tracks = queue.tracks.toArray();

    if (tracks[0]) {
        const list = getQueue(tracks);
        return [list, embed];
    }
    else {
        return [embed];
    }
}

async function sendMessage(queue) {
    const { client, channel, guildId } = queue.metadata;
    const btStatus = client.stButtons.get(guildId);

    const embeds = sendEmbeds(queue);
    const buttons = sendButtons(queue, btStatus);

    //checking the latest message
    const scan = await channel.messages.fetch({ limit: 1 });
    const lastMess = scan.first();

    //if this channel doesn't have any message
    if (!lastMess) {
        return channel.send({ embeds: embeds, components: buttons });
    }

    //if this latest messages is my bot's message
    if (lastMess.author.id === client.user.id) {
        //scan all others my bot's messages 
        const allMess = (await channel.messages.fetch()).filter((msg) => msg.author.bot && msg.author.id === client.user.id);

        //if my bot just sent 1 message
        if (allMess.size === 1) {
            return allMess.first().edit({ embeds: embeds, components: buttons });
        }

        //if my bot send more messages
        if (allMess.size > 1) {
            try {
                await Promise.all(allMess.map((msg) => msg.delete()));
            } catch (error) {
                console.error(error);
            } finally {
                return channel.send({ embeds: embeds, components: buttons });
            }
        }
    }
    else //if the latest message is not my bot's message 
    {
        const allMess = (await channel.messages.fetch()).filter((msg) => msg.author.bot && msg.author.id === client.user.id);
        try {
            await Promise.all(allMess.map((msg) => msg.delete()));
        } catch (error) {
            console.error(error);
        } finally {
            return channel.send({ embeds: embeds, components: buttons });
        }
    }
}

module.exports = {
    sendButtons,
    sendMessage
}