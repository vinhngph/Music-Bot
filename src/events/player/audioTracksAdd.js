module.exports = {
    name: 'audioTracksAdd',
    async execute(queue) {
        const client = queue.metadata.client;
        const channel = queue.metadata.channel;

        const addStatus = await client.addStatus.get(channel.id);
        if (!addStatus) {
            return client.addStatus.set(channel.id, true);
        }

        return client.config.sendMessage(queue, queue.currentTrack);
    }
}