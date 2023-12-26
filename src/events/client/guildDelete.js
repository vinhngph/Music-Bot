const { Events } = require('discord.js');

module.exports = {
    name: Events.GuildDelete,
    once: true,
    async execute(guild, client) {
        const serverCount = client.guilds.cache.size;

        try {
            await client.addStatus.delete(guild.id);
        } catch (error) {
            console.error(error);
        } finally {
            console.log(`[-] Total = ${serverCount}`);
        }
    }
}