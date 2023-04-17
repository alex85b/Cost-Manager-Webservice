module.exports = function(target, regEx) {
    if(!target) return false;
    return regEx.test(target);
}