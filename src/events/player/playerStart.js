module.exports = {
    name: 'playerStart',
    async execute(queue, track) {
        const client = queue.metadata.client;

        return client.config.sendMessage(queue, track);
    }
}