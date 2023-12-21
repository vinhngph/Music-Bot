const { useQueue } = require('discord-player');

module.exports = {
    data: {
        name: `extend`
    },
    async execute(interaction) {
        const response = await interaction.deferReply({ ephemeral: true });
        try {
            const client = interaction.client;
            const channel = interaction.channel;
            const queue = useQueue(interaction.guildId);

            const status = client.stButtons.get(channel.id);
            if (!status) {
                await client.stButtons.set(channel.id, true);
            } else {
                await client.stButtons.set(channel.id, false);
            }

            const curStatus = client.stButtons.get(channel.id);

            const scan = await channel.messages.fetch({ limit: 1 });
            const curMess = scan.first();

            if (curMess && (curMess.author.id === client.user.id)) {
                const buttons = client.config.sendButtons(queue, curStatus);

                curMess.edit({ components: buttons });
            }
        } catch (error) {
            console.error(error);
        } finally {
            return response.delete();
        }
    }
}