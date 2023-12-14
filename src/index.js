require('dotenv').config();

const os = require('os')
const threadpoolSize = os.cpus().length;
process.env.UV_THREADPOOL_SIZE = threadpoolSize;
console.log(`[-] This system has ${threadpoolSize} cores`);

const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./src/bot.js', { token: process.env.TOKEN });
manager.on('shardCreate', shard => console.log(`[-] Launched shard ${shard.id}`));
manager.spawn();

const express = require('express');
const app = express();
const port = process.env.PORT;
app.use("/", (req, res) => {
    res.send(`BOT is ready to use!`);
})
app.listen(port, () => {
    console.log(`[-] BOT is running on port ${port}`)
})