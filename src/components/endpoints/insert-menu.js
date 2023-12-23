const { useQueue, useMainPlayer, QueryType } = require('discord-player');

module.exports = {
    data: {
        name: `insert-menu`
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
        const queue = useQueue(interaction.guildId);

        const result = await player.search(query);

        return queue.insertTrack(result.tracks[0], 0);
    }
}
