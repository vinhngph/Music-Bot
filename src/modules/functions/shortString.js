function shortString(input) {
    const length = 40;
    if (input.length <= length) return input;

    return input.substring(0, length - 3) + "...";
}

module.exports = {
    shortString
}
