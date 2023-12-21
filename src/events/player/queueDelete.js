module.exports = {
    name: 'queueDelete',
    async execute(queue) {
        const client = queue.metadata.client;
        const channel = queue.metadata.channel;

        await client.addStatus.set(channel.id, false);
        await client.stButtons.set(channel.id, false);
        
        return client.config.sendMessage(queue);
    }
}