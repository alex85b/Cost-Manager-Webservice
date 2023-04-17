module.exports = function(target, regEx) {
    if(!target) return 0;
    return regEx.test(target) ? 1 : -1;
}