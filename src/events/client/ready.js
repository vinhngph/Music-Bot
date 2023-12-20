const { Events, ActivityType, REST, Routes } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
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

            const guilIDs = client.guilds.cache.map(guild => guild.id);

            for (const guildID of guilIDs) {
                rest.put(Routes.applicationGuildCommands(process.env.APP_ID, guildID),
                    { body: commands })
            }
        } catch (error) {
            console.error(error);
        } finally {
            console.log(`[-] Ready! Logged in as ${client.user.tag}`);
        }
    }
}