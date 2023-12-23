const checkLength = input => {
    const length = 8;
    if (input.length <= length) return input;

    const cutDown = input.substring(0, length -3);

    return cutDown + "...";
}

const input = "1231231231234132523543534645654756867978987089089"
console.log(input.length)