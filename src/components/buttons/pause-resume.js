const { useQueue } = require('discord-player');

module.exports = {
    data: {
        name: `pause-resume`
    },
    async execute(interaction) {
        const response = await interaction.deferReply({ ephemeral: true });
        try {
            const queue = useQueue(interaction.guildId);
            if (!queue.node.isPaused()) {
                queue.node.pause();
            }
            else {
                queue.node.resume();
            }
        } catch (error) {
        } finally {
            return response.delete();
        }
    }
}