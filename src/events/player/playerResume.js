module.exports = {
    name: 'playerResume',
    async execute(queue) {
        const client = queue.metadata.client;

        return client.config.sendMessage(queue, true);
    }
}