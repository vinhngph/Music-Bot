module.exports = {
    name: 'audioTracksAdd',
    async execute(queue) {
        const client = queue.metadata.client;
        const guildId = queue.metadata.guildId;

        const addStatus = await client.addStatus.get(guildId);
        if (!addStatus) {
            return client.addStatus.set(guildId, true);
        }
        return client.config.sendMessage(queue);
    }
}