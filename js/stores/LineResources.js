'use strict';

var Immutable = require('immutable'),
    _datas = require('./lines.json'),
    _names = Immutable.List(_datas.names),
    _mapDatas = require('./map.json'),
    _map = Immutable.fromJS(_mapDatas);

/**
 * return the data structure to draw the maps
 * @param {String} line
 * @returns {List<T>|List<any>}
 */
function getStations(line) {
    return _map.get('lines').get(line);
}

/**
 * Return the lines we care about
 * screw Mattapan, yay Silver line
 * @returns {List<T>|List<any>}
 */
function getLineNames() {
    return _names;
}

module.exports = {
    getLineNames: getLineNames,
    getStations: getStations
};
