const { useHistory } = require('discord-player');

module.exports = {
    data: {
        name: `previous`
    },
    async execute(interaction) {
        const response = await interaction.deferReply({ ephemeral: true });
        try {
            const queue = useHistory(interaction.guildId);
            queue.previous();
        } catch (error) {
            console.error(error);
        } finally {
            return response.delete();
        }
    }
}