const fs = require('fs')

module.exports = (client) => {
    client.handleCommands = async () => {
        const commandFiles = fs.readdirSync(`./src/commands`).filter((file) => file.endsWith('.js'));
        
        for (const file of commandFiles) {
            const command = require(`../commands/${file}`);
            client.commands.set(command.data.name, command);
            client.commandArray.push(command.data.toJSON());
        }
    }
}