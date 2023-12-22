const { useQueue } = require('discord-player');

module.exports = {
    data: {
        name: `shuffle`
    },
    async execute(interaction) {
        const response = await interaction.deferReply({ ephemeral: true });
        try {
            const queue = useQueue(interaction.guildId);
            const client = interaction.client;
            queue.toggleShuffle();
            client.config.sendMessage(queue, queue.currentTrack);
        } catch (error) {
            console.error(error);
        } finally {
            return response.delete();
        }
    }
}