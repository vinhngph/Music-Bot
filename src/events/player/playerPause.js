module.exports = {
    name: 'playerPause',
    async execute(queue) {
        const client = queue.metadata.client;

        return client.config.sendMessage(queue);
    }
}