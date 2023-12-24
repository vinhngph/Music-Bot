function getEngine(client, guildId) {
    let engine = client.engine.get(guildId);
    if (!engine) {
        client.engine.set(guildId, 'spotify');
    }
    return client.engine.get(guildId);
}

module.exports = {
    getEngine
}