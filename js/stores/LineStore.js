'use strict';

var EventEmitter = require('events'),
    Immutable = require('immutable'),
    AppDispatcher = require('../AppDispatcher'),
    AppConstants = require('../AppConstants'),
    LineResources = require('./LineResources'),
    _lineNames = LineResources.getImmutLineNames(),
    _lineStatuses = LineResources.getImmutLineStatuses(),
    _lines = Immutable.Map(),
    _lines = _lines.set('Red', Immutable.Map({
        'name': 'Red',
        'status': 'fucked'
    })),
    _lines = _lines.set('Silver', Immutable.Map({
        'name': 'Silver',
        'status': 'fine'
    })),
    _lines = _lines.set('Green', Immutable.Map({
        'name': 'Green',
        'status': 'SO fucked'
    })),
    _lines = _lines.set('Blue', Immutable.Map({
        'name': 'Blue',
        'status': 'meh'
    })),
    _lines = _lines.set('Orange', Immutable.Map({
        'name': 'Orange',
        'status': 'fucked'
    }));
//TODO: remove all of those! ^^^^

/**
 * Querying a random member of a structure.
 * @param {List<T>|List<any>} immutablePool - Immutable.List instance
 * @returns {*}
 * @private
 */
function _getRandom(immutablePool) {
    var rnd = Math.floor(Math.random() * (immutablePool.size - 1));
    return immutablePool.get(rnd);
}

/**
 * Creating an immutable Line object with the given name and a random status.
 * @param {string} name
 * @private
 */
function _create(name) {
    var rndStatus = _getRandom(_mbtaStatuses);
    _lines = _lines.set(name, rndStatus);
}

function _random() {
    var rndName = _getRandom(_lineNames),
        rndStatus = _getRandom(_lineStatuses);
    _lines = _lines.set(rndName, rndStatus);
}

/**
 * Creating the store with the sweet new ES6 class syntax.
 */
class LineStore extends EventEmitter {
    constructor() {
        super();

        this._dispatchToken = AppDispatcher.register(
                (action) => {
                    switch (action.type) {
                        case AppConstants.CREATE:
                            _create(action.payload);
                            this.emit(AppConstants.CHANGE_EVENT);
                            break;

                        case AppConstants.RANDOM:
                            _random();
                            this.emit(AppConstants.CHANGE_EVENT);
                            break;

                        default:
                            return console.error(new Error('noop'));
                    }
                });
    }

    getLines() {
        return _lines;
    }
}

module.exports = new LineStore();
