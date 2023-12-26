module.exports = {
    name: 'playerError',
    async execute(queue, error) {
        const channel = queue.metadata.channel;
        const client = queue.metadata.client;
        const bugChannel = client.channels.cache.get(process.env.BUG_CHANNEL);

        await bugChannel.send(`--------------------------------------------------------------------------------------\n${error}\n--------------------------------------------------------------------------------------`);

        return channel.send('Please try another song :(');
    }
}