module.exports = {
    name: 'playerStart',
    async execute(queue, track) {
        console.log("1");
        queue.metadata.channel.send(`Started playing **${track.title}**!`);
    }
}