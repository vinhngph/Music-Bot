const { Events, REST, Routes } = require('discord.js')

module.exports = {
    name: Events.GuildCreate,
    async execute(guild, client) {
        const rest = new REST().setToken(process.env.TOKEN);
        const commands = client.commandArray;
        const serverCount = client.guilds.cache.size;

        try {
            await rest.put(Routes.applicationGuildCommands(process.env.APP_ID, guild.id),
                { body: commands })
        } catch (error) {
            console.error(error);
        } finally {
            console.log(`[-] Added ${guild.name} server - Total = ${serverCount}`);
        }
    }
}