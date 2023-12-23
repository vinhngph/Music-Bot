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
            const channel = interaction.channel;
            const guildId = interaction.guildId;

            queue.toggleShuffle();

            const curStatus = client.stButtons.get(guildId);

            const scan = await channel.messages.fetch({ limit: 1 });
            const curMess = scan.first();

            if (curMess && (curMess.author.id === client.user.id)) {
                const buttons = client.config.sendButtons(queue, curStatus);

                curMess.edit({ components: buttons });
            }
        } catch (error) {
        } finally {
            return response.delete();
        }
    }
}