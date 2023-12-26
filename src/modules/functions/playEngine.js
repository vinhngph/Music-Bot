const { QueryType } = require('discord-player');

function getEngine(client, guildId) {
    let engine = client.engine.get(guildId);
    if (!engine) {
        client.engine.set(guildId, 'spotify');
    }
    return client.engine.get(guildId);
}

function searchEngine(engine) {
    if (engine === 'apple_music') {
        return QueryType.APPLE_MUSIC_SEARCH;
    }
    if (engine === 'spotify') {
        return QueryType.SPOTIFY_SEARCH;
    }
    if (engine === 'soundcloud') {
        return QueryType.SOUNDCLOUD_SEARCH;
    }
    if (engine === 'youtube') {
        return QueryType.YOUTUBE_SEARCH;
    }
}

function shortString(input) {
    const length = 40;
    if (input.length <= length) return input;

    return input.substring(0, length - 3) + "...";
}

function shortUrl(url, engine) {
    const enginePatterns = {
        'apple_music': /^https:\/\/music\.apple\.com\//,
        'spotify': /^https:\/\/open\.spotify\.com\//,
        'soundcloud': /^https:\/\/soundcloud\.com\//,
        'youtube': /^https:\/\/www\.youtube\.com\//,
    };

    const pattern = enginePatterns[engine] || /^https?:\/\//;
    return url.replace(pattern, '');
};


module.exports = {
    getEngine,
    searchEngine,
    shortString,
    shortUrl
}