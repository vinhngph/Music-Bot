const { useQueue } = require('discord-player');

module.exports = {
    data: {
        name: `delete`
    },
    async execute(interaction) {
        const response = await interaction.deferReply({ ephemeral: true });

        const queue = useQueue(interaction.guildId);
        queue.delete();
        return response.delete();
    }
}