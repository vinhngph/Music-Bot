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
    shortUrl
}