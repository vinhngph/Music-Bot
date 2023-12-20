const { Events } = require('discord.js');

module.exports = {
    name: Events.GuildDelete,
    once: true,
    async execute(guild, client) {
        const channelID = client.useTextChannel.get(guild.id);
        
        try {
            await client.addStatus.delete(channelID);
        } catch (error) {
            console.error(error);
        } finally {
            console.log(`[-] Total = ${config.italics(serverCount)}`);
        }
    }
}