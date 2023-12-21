const { useMainPlayer } = require('discord-player');

module.exports = {
    data: {
        name: `songModal`
    },
    async execute(interaction) {
        const data = await interaction.fields.getTextInputValue('songData');
        const query = data.toString();
        const player = useMainPlayer();

        player.play(interaction.member.voice.channel, query, {
            nodeOptions: {
                metadata: interaction
            }
        });
    }
}