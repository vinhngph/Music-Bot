module.exports = {
    name: 'playerStart',
    async execute(queue, track) {
        queue.metadata.channel.send(`Started playing **${track.title}**!`);
    }
}