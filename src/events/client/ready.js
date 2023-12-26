const { Events, ActivityType, REST, Routes } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        const serverCount = client.guilds.cache.size;
        try {
            client.user.setPresence({
                activities: [{
                    name: `Status`,
                    type: ActivityType.Custom,
                    state: `Listening to music | /𝗽𝗹𝗮𝘆`
                }],
                status: 'online'
            });

            const rest = new REST().setToken(process.env.TOKEN);
            const commands = client.commandArray;
            const guildIds = client.guilds.cache.map(guild => guild.id);

            for (const guildId of guildIds) {
                rest.put(Routes.applicationGuildCommands(process.env.APP_ID, guildId),
                    { body: commands })
            }
        } catch (error) {
            console.error(error);
        } finally {
            console.log(`[-] ${client.user.tag} is running on ${serverCount} servers`);
        }
    }
}