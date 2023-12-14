const { Events, REST, Routes } = require('discord.js')

module.exports = {
    name: Events.GuildCreate,
    async execute(guild, client) {
        const rest = new REST().setToken(process.env.TOKEN)
        const commands = client.commandArray;
        const config = client.config;
        const serverCount = client.guilds.cache.size;

        await rest.put(Routes.applicationGuildCommands(process.env.APP_ID, guild.id),
            { body: commands })
        console.log(`[-] Added ${config.italics(guild.name)} server - Total = ${config.italics(serverCount)}`);
    }
}