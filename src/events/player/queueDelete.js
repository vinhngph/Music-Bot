module.exports = {
    name: 'queueDelete',
    async execute(queue) {
        const { client, guildId } = queue.metadata;

        await client.addStatus.set(guildId, false);
        await client.stButtons.set(guildId, false);

        return client.config.sendMessage(queue, false);
    }
}