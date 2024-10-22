const fs = require('fs');

module.exports = (client, player) => {
    client.handleEvents = async () => {
        const eventFolders = fs.readdirSync(`./src/events`);
        for (const folder of eventFolders) {
            try {
                switch (folder) {
                    case "client":
                        const eventFiles = fs.readdirSync(`./src/events/${folder}`).filter((file) => file.endsWith('.js'));

                        for (const file of eventFiles) {
                            const event = require(`../events/${folder}/${file}`);
                            if (event.once) {
                                client.once(event.name, (...args) => event.execute(...args, client));
                            } else {
                                client.on(event.name, (...args) => event.execute(...args, client));
                            }
                        }
                        break;
                    case "player":
                        const functionFiles = fs.readdirSync(`./src/events/${folder}`).filter((file) => file.endsWith('.js'));

                        for (const file of functionFiles) {
                            const event = require(`../events/${folder}/${file}`);
                            player.events.on(event.name, (...args) => event.execute(...args, player));
                        }
                        break;
                    default:
                        break;
                }
            } catch (error) {
                console.error(error)
            }
        }
    }
}