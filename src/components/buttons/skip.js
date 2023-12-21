const { useQueue } = require('discord-player');

module.exports = {
    data: {
        name: `skip`
    },
    async execute(interaction) {
        const response = await interaction.deferReply({ ephemeral: true });
        try {
            const queue = useQueue(interaction.guildId);
            queue.node.skip();
        } catch (error) {
            console.error(error);
        } finally {
            return response.delete();
        }
    }
}