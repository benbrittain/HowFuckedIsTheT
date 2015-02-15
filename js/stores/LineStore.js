'use strict';

var EventEmitter = require('events'),
    Immutable = require('immutable'),
    AppDispatcher = require('../AppDispatcher'),
    AppConstants = require('../AppConstants'),
    TrainStore = require('./TrainStore'),
    LineResources = require('./LineResources'),
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
 * Create the Lines object which contains the Name of the Line, MBTA id
 * and status of the line in the private Store
 * @param {Immutable Map} lines
 * @private
 */
function _createLines(lines) {
    console.log(lines);
    _lines = _lines
}

/**
 * Update the Status/Fuckedness of the appropriate MBTA Line
 * in the private Store
 * @private
 */
function _calculateFuckedness() {
    // The meat of this whole thing
    // alerts?! average time till arival?
    // manual setting?
    _lines = _lines;
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
                        case AppConstants.LOAD_ROUTES:
                            _createLines(action.payload);
                            this.emit(AppConstants.CHANGE_EVENT);
                            break;

                        case AppConstants.UPDATE_ROUTES:
                            AppDispatcher.waitFor([TrainStore.dispatchToken]);
                            console.log('after the trainstore');
                            _calculateFuckedness(action.payload);
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
