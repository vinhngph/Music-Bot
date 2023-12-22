const { useQueue, useMainPlayer, QueryType } = require('discord-player');

module.exports = {
    data: {
        name: `insert-menu`
    },
    async execute(interaction) {
        const query = interaction.values[0];

        const player = useMainPlayer();
        const queue = useQueue(interaction.guildId);

        const result = await player.search(query);

        return queue.insertTrack(result.tracks[0], 0);
    }
}
