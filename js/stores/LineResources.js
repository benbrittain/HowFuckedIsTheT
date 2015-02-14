'use strict';
var Immutable = require('immutable'),
    _datas = require('../../assets/lines.json'),
    _names = Immutable.List(_datas.names),
    _statuses = Immutable.List(_datas.statuses);

/**
 * Return line names
 * @returns {List<T>|List<any>}
 */
function getImmutLineNames() {
    return _names;
}

/**
 * Return possible line statuses
 * @returns {List<T>|List<any>}
 */
function getImmutLineStatuses() {
    return _statuses;
}

module.exports = {
    getImmutLineNames: getImmutLineNames,
    getImmutLineStatuses: getImmutLineStatuses
};
