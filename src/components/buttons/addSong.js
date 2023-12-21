const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    data: {
        name: `addSong`
    },
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('songModal')
            .setTitle('Add Song');

        const songData = new TextInputBuilder()
            .setCustomId('songData')
            .setLabel("Input song name or link")
            .setStyle(TextInputStyle.Short);

        const adding = new ActionRowBuilder().addComponents(songData);

        modal.addComponents(adding);

        await interaction.showModal(modal);
    }
}