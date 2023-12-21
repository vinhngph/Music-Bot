const { ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const diamond = `<a:diamond:1130862729901637723>`;
const musicPlaying = `<a:music:1130466218239873087>`;
const waitThumnail = "https://cdn.discordapp.com/attachments/1128652851636351097/1177880647004594176/Untitled_design.png?ex=65741dd6&is=6561a8d6&hm=b1cdaaf197ff80c8ad62cafb2e4e5e22f4f0deddb865b28957d514ea6e4672aa&";
const colorEmbed = '#000000';

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
    const embed = new EmbedBuilder()
        .setColor(colorEmbed)
        .setTitle(`**${track.title}**`)
        .setURL(track.url)
        .addFields(
            { name: 'Author', value: `${track.author} ${diamond}`, inline: true },
            { name: 'Duration', value: `${track.duration}`, inline: true },
            { name: 'Source', value: `${track.source.charAt(0).toUpperCase() + track.source.substring(1)}`, inline: true },
        )
        .setImage(track.thumbnail)
    return embed;
}

function basicButtons(queue) {
    const tracks = queue.tracks.toArray();

    let buttons = []
    buttons[0] = new ButtonBuilder()
        .setCustomId('extend')
        .setLabel('☰')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(!queue.connection)

    buttons[1] = new ButtonBuilder()
        .setCustomId('previous')
        .setLabel('◁')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(!queue.history.previousTrack ? true : false)

    buttons[2] = new ButtonBuilder()
        .setCustomId('pause-resume')
        .setLabel(queue.node.isPaused() ? '▶' : '||')
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

    let buttons = []
    buttons[0] = new ButtonBuilder()
        .setCustomId('extend')
        .setLabel('☰')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(!queue.connection)

    buttons[1] = new ButtonBuilder()
        .setCustomId('previous')
        .setLabel('◁')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(!queue.history.previousTrack ? true : false)

    buttons[2] = new ButtonBuilder()
        .setCustomId('pause-resume')
        .setLabel(queue.node.isPaused() ? '▶' : '||')
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

    buttons[5] = new ButtonBuilder()
        .setCustomId('delete')
        .setLabel(`🔲`)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(!queue.connection)

    buttons[6] = new ButtonBuilder()
        .setCustomId('2')
        .setLabel('2')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true)

    buttons[7] = new ButtonBuilder()
        .setCustomId('3')
        .setLabel('3')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true)

    buttons[8] = new ButtonBuilder()
        .setCustomId('4')
        .setLabel('4')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true)

    buttons[9] = new ButtonBuilder()
        .setCustomId('5')
        .setLabel('5')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true)

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
    const embed = media(track);
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
    const status = client.stButtons.get(channel.id);

    let embed;
    if (!track) {
        const waitEmbed = new EmbedBuilder()
            .setColor(colorEmbed)
            .setTitle(`**EMPTY PLAYLIST**`)
            .setImage(waitThumnail)
        embed = [waitEmbed]
    } else {
        embed = sendEmbeds(queue, track);
    }

    const getButtons = sendButtons(queue, status);


    const scan = await channel.messages.fetch({ limit: 5 });
    const curMess = scan.first();

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