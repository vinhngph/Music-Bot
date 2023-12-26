const { useHistory } = require('discord-player');

module.exports = {
    data: {
        name: `previous`
    },
    async execute(interaction) {
        const response = await interaction.deferReply({ ephemeral: true });
        const queue = useHistory(interaction.guildId);
        queue.previous();

        return response.delete();
    }
}