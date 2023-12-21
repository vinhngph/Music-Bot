const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { Player } = require('discord-player');

const fs = require('fs');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageTyping
    ]
});

const player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    },
    skipFFmpeg: false,
    useLegacyFFmpeg: false
});
player.extractors.loadDefault();

client.config = require('./modules/config.js');
client.addStatus = new Map();
client.stButtons = new Map();

client.commands = new Collection();
client.commandArray = [];

client.buttons = new Collection();
client.endpoints = new Collection();
client.modals = new Collection();
client.cooldowns = new Collection();

process.on('unhandledRejection', async (reason, promise) => { });
process.on('uncaughtException', (err) => { });
process.on('uncaughtExceptionMonitor', (err, origin) => { });

const functionFiles = fs.readdirSync(`./src/handlers`).filter(file => file.endsWith('.js'));
for (const file of functionFiles) require(`./handlers/${file}`)(client, player);

client.handleCommands();
client.handleComponents();
client.handleEvents();

client.login(process.env.TOKEN);