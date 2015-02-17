'use strict';

var Immutable = require('immutable')

/**
 * Looks up deep values in src from the given list of strings
 * @param {Immutable Map} src
 * @param {Immutable List} lookup
 * @return {Immutable List}
 * @private
 */
function getDeepImmutableValues(src, lookup) {
    if (src === undefined) {
        return Immutable.List();
    } else if (lookup.size === 1) {
        return src.get(lookup.first());
    } else if (lookup.size > 1) {
        var key = lookup.first();
        if (src.has(key)) {
            return src.get(key).flatMap(function(s) {
                return getDeepImmutableValues(s, lookup.shift());
            });
        } else {
            return Immutable.List();
        }
    } else {
        return src;
    }
}

module.exports.getDeepImmutableValues = getDeepImmutableValues;
