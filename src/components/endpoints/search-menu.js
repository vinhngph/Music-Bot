const { useMainPlayer } = require('discord-player');

module.exports = {
    data: {
        name: `search-menu`
    },
    async execute(interaction) {
        const client = interaction.client;
        const guildId = interaction.guildId;
        const engine = await client.engine.get(guildId);

        let pattern;
        switch (engine) {
            case 'apple_music':
                pattern = 'https://music.apple.com/';
                break;
            case 'spotify':
                pattern = 'https://open.spotify.com/';
                break;
            case 'soundcloud':
                pattern = 'https://soundcloud.com/';
                break;
            case 'youtube':
                pattern = 'https://www.youtube.com/';
                break;

            default:
                break;
        }

        let query = interaction.values[0];
        query = pattern + query;

        const player = useMainPlayer();

        return player.play(interaction.member.voice.channel, query, {
            nodeOptions: {
                metadata: interaction,
                disableFilterer: true,
                defaultFFmpegFilters: false,
                volume: 50
            }
        });
    }
}
