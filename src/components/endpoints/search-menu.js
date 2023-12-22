const { useMainPlayer } = require('discord-player');

module.exports = {
    data: {
        name: `search-menu`
    },
    async execute(interaction) {
        let query = interaction.values[0];
        query = "https://" + query;

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
