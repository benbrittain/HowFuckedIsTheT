'use strict';

var Immutable = require('immutable'),
    _datas = require('./lines.json'),
    _names = Immutable.List(_datas.names)

/**
 * Return the lines we care about
 * screw Mattapan, yay Silver line
 * @returns {List<T>|List<any>}
 */
function getLineNames() {
    return _names;
}

module.exports = {
    getLineNames: getLineNames
};
