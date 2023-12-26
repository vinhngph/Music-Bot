module.exports = {
    name: 'disconnect',
    async execute(queue) {
        const { client, guildId } = queue.metadata;

        const st = client.addStatus.get(guildId);
        if (!st) return;

        await client.addStatus.set(guildId, false);
        await client.stButtons.set(guildId, false);

        return client.config.sendMessage(queue);
    }
}