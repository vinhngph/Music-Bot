const { useQueue, QueueRepeatMode } = require('discord-player');

module.exports = {
    data: {
        name: `loopMode`
    },
    async execute(interaction) {
        const queue = useQueue(interaction.guildId);
        const client = interaction.client;

        const mode = interaction.values[0];

        if (mode === '0') {
            queue.setRepeatMode(QueueRepeatMode.OFF);
        } else if (mode === '1') {
            queue.setRepeatMode(QueueRepeatMode.TRACK);
        } else if (mode === '2') {
            queue.setRepeatMode(QueueRepeatMode.QUEUE);
        }

        return client.config.sendMessage(queue, queue.currentTrack);
    }
}