const { useQueue } = require('discord-player');

module.exports = {
    data: {
        name: `extend`
    },
    async execute(interaction) {
        const response = await interaction.deferReply({ ephemeral: true });
        const client = interaction.client;
        const channel = interaction.channel;
        const guildId = interaction.guildId;

        const queue = useQueue(guildId);

        const status = client.stButtons.get(guildId);
        if (!status) {
            await client.stButtons.set(guildId, true);
        } else {
            await client.stButtons.set(guildId, false);
        }

        const curStatus = client.stButtons.get(guildId);

        const scan = await channel.messages.fetch({ limit: 1 });
        const curMess = scan.first();

        if (curMess && (curMess.author.id === client.user.id)) {
            const buttons = client.config.sendButtons(queue, curStatus);

            curMess.edit({ components: buttons });
        }

        return response.delete();
    }
}