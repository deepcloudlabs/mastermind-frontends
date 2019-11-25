var createNumber = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var hasDuplicateDigits = function (number) {
    var digits = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    number = number.toString();
    for (var i = 0; i < number.length; ++i) {
        var digit = new Number(number.charAt(i));
        digits[digit]++;
    }
    for (var i = 0; i < digits.length; ++i) {
        if (digits[i] > 1) return true;
    }
    return false;
}

var createSecret = function () {
    var candidate;
    do {
        candidate = createNumber(102, 987);
    } while (hasDuplicateDigits(candidate)) ;
    return candidate;
}