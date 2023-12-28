module.exports = {
    name: 'playerStart',
    async execute(queue) {
        const tracks = queue.tracks.toArray();
        if (!tracks[1]) {
            await queue.disableShuffle();
        }
        const client = queue.metadata.client;

        return client.config.sendMessage(queue, true);
    }
}