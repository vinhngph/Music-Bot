module.exports = {
    name: 'queueDelete',
    async execute(queue) {
        const client = queue.metadata.client;
        const guildId = queue.metadata.guildId;

        await client.addStatus.set(guildId, false);
        await client.stButtons.set(guildId, false);

        return client.config.sendMessage(queue);
    }
}