function toCamelCase(inputString) {
    let words = inputString.split('_');

    let camelCaseString = words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');

    return camelCaseString;
};

module.exports = {
    toCamelCase
}