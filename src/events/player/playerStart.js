module.exports = {
    name: 'playerStart',
    async execute(queue, track) {
        const tracks = queue.tracks.toArray();
        if(!tracks [1]) {
            await queue.disableShuffle();
        }
        const client = queue.metadata.client;

        return client.config.sendMessage(queue, track);
    }
}