const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    data: {
        name: `insertTrack`
    },
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('insertModal')
            .setTitle('Next song you want');

        const songData = new TextInputBuilder()
            .setCustomId('songData')
            .setLabel("Input song name or link")
            .setStyle(TextInputStyle.Short);

        const adding = new ActionRowBuilder().addComponents(songData);

        modal.addComponents(adding);

        await interaction.showModal(modal);
    }
}