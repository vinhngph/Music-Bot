const { useQueue } = require('discord-player');

module.exports = {
    data: {
        name: `skip`
    },
    async execute(interaction) {
        const response = await interaction.deferReply({ ephemeral: true });

        const queue = useQueue(interaction.guildId);
        queue.node.skip();

        return response.delete();
    }
}