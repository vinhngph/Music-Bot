const { useQueue, QueueRepeatMode } = require('discord-player');

module.exports = {
    data: {
        name: `autoplay`
    },
    async execute(interaction) {
        const response = await interaction.deferReply({ ephemeral: true });
        try {
            const queue = useQueue(interaction.guildId);
            const client = interaction.client;

            if (queue.repeatMode === 3) {
                queue.setRepeatMode(QueueRepeatMode.OFF);
            } else {
                queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
            }

            client.config.sendMessage(queue, queue.currentTrack);
        } catch (error) {
        } finally {
            return response.delete();
        }
    }
}