const { ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const diamond = `<a:diamond:1130862729901637723>`;
const musicPlaying = `<a:music:1130466218239873087>`;
const waitThumnail = "https://cdn.discordapp.com/attachments/1128652851636351097/1177880647004594176/Untitled_design.png?ex=65741dd6&is=6561a8d6&hm=b1cdaaf197ff80c8ad62cafb2e4e5e22f4f0deddb865b28957d514ea6e4672aa&";
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

function buttons(queue) {
    let buttons = []
    buttons[0] = new ButtonBuilder()
        .setCustomId('exit')
        .setLabel('🚫')
        .setStyle(ButtonStyle.Danger)
        .setDisabled(true)

    buttons[1] = new ButtonBuilder()
        .setCustomId('previous')
        .setLabel('⏪')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true)

    buttons[2] = new ButtonBuilder()
        .setCustomId('pause-resume')
        .setLabel('▶️')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true)

    buttons[3] = new ButtonBuilder()
        .setCustomId('skip')
        .setLabel('⏩️')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true)

    buttons[4] = new ButtonBuilder()
        .setCustomId('addSong')
        .setLabel('➕')
        .setStyle(ButtonStyle.Primary)


    return [
        {
            type: 1,
            components: [buttons[0], buttons[1], buttons[2], buttons[3], buttons[4]]
        }
    ]
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
    
    const getButtons = buttons(queue);
    

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
    buttons,
    sendEmbeds,
    sendMessage
}