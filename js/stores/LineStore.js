'use strict';

var EventEmitter = require('events'),
    Immutable = require('immutable'),
    AppDispatcher = require('../AppDispatcher'),
    AppConstants = require('../AppConstants'),
    TrainStore = require('./TrainStore'),
    LineResources = require('./LineResources'),
    _names = LineResources.getLineNames(),
    _lines = Immutable.Map();

/**
 * Create the Lines object which contains the Name of the Line, MBTA id
 * and status of the line in the private Store
 * @param {Immutable Map} lines
 * @private
 */
function _createLines(lines) {
    _names.forEach(function(colour) {
        var state = Immutable.Map()
            state = state.set('name', colour)
            state = state.set('ids', lines.get(colour))
            state = state.set('fuckedness', 'probably fucked');
            state = state.set('wait', 'unknown');
        // Foolishly give the MBTA benefit of the doubt by default
        _lines = _lines.set(colour, state);
    });
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
    var lines = TrainStore.getTrainLines();
}

/**
 * Creating the store with the sweet new ES6 class syntax.
 */
class LineStore extends EventEmitter {
    constructor() {
        super();
        LineStore.dispatchToken = AppDispatcher.register(
                (action) => {
                    switch (action.type) {
                        case AppConstants.LOAD_ROUTES:
                            _createLines(action.payload);
                            this.emit(AppConstants.CHANGE_EVENT);
                            break;

                        case AppConstants.UPDATE_ROUTES:
                            // Ensure that the TrainStore has all the necessary info
                            AppDispatcher.waitFor([TrainStore.dispatchToken]);
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
module.exports.dispatchToken = LineStore.dispatchToken;
