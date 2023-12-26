const { useQueue, QueueRepeatMode } = require('discord-player');

module.exports = {
    data: {
        name: `autoplay`
    },
    async execute(interaction) {
        const response = await interaction.deferReply({ ephemeral: true });

        const queue = useQueue(interaction.guildId);
        const client = interaction.client;

        if (queue.repeatMode === 3) {
            queue.setRepeatMode(QueueRepeatMode.OFF);
        } else {
            queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
        }

        await client.config.sendMessage(queue);
        return response.delete();
    }
}