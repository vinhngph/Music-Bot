module.exports = {
    data: {
        name: `songModal`
    },
    async execute(interaction) {
        const client = interaction.client;
        const data = await interaction.fields.getTextInputValue('songData');
        const query = data.toString();

        return client.play(interaction, query, 'search-menu');
    }
}