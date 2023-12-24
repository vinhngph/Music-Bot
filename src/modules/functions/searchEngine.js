function searchEngine(engine) {
    const { QueryType } = require('discord-player');

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

module.exports = {
    searchEngine
}