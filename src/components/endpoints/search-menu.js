const { useMainPlayer } = require('discord-player');

module.exports = {
    data: {
        name: `search-menu`
    },
    async execute(interaction) {
        const query = interaction.values[0];
        const player = useMainPlayer();

        player.play(interaction.member.voice.channel, query, {
            nodeOptions: {
                metadata: interaction,
                disableFilterer: true,
                defaultFFmpegFilters: false,
                volume: 50
            }
        });
    }
}
