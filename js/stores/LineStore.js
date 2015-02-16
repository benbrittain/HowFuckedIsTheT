'use strict';

var EventEmitter = require('events'),
    Immutable = require('immutable'),
    AppDispatcher = require('../AppDispatcher'),
    AppConstants = require('../AppConstants'),
    TrainStore = require('./TrainStore'),
    LineResources = require('./LineResources'),
    Utils = require('../utils'),
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
            state = state.set('fuckedness', 'Probably fucked');
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
    var trainLines = TrainStore.getTrainLines();
    _names.forEach(function(colour) {
        var allStops = Utils.getDeepImmutableValues(trainLines, Immutable.List([colour, 'direction', 'trip', 'stop']));
        if (allStops) {
            var waitTimes = Immutable.Map();
            allStops.forEach(function(stop) {
                if (stop.get('stop_id') && stop.get('pre_away')) {
                    var stopId = stop.get('stop_id');
                    var wait = parseInt(stop.get('pre_away'));
                    var previousWait = waitTimes.get(stopId);
                    if (previousWait === undefined || wait < previousWait) {
                        waitTimes = waitTimes.set(stopId, wait);
                    }
                }
            });
            _updateLineWait(colour, _averageWait(waitTimes));
        }
    });
}

/**
 * Updates the given line with the average wait provided
 * @param {String} colour
 * @param {Number} avgWait
 * @private
 */
function _updateLineWait(colour, avgWait) {
    if (colour && avgWait) {
        var line = _lines.get(colour);
        line = line.merge({
            'wait': Math.round(avgWait / 60).toString() + ' mins',
            'fuckedness': _secondsToFuckedness(avgWait)
        });
        _lines = _lines.set(colour, line);
    }
}

/**
 * @param {Immutable List} stops
 * @return {Number}
 * @private
 */
function _averageWait(stops) {
    if (stops.size > 0) {
        var sum = stops.reduce(function(previousValue, currentValue, index, array) {
            return previousValue + currentValue;
        });
        return sum / stops.size;
    } else {
        return undefined;
    }
}

/**
 * @param {Number} seconds
 * @return {String}
 * @private
 */
function _secondsToFuckedness(seconds) {
    if (seconds === undefined ) {
        return 'Probably fucked';
    } else if (seconds <= 300) {
        return 'Not fucked at all';
    } else if (seconds > 300 && seconds <= 600) {
        return 'A little fucked';
    } else if (seconds > 600 && seconds <= 900) {
        return 'Kinda fucked';
    } else if (seconds > 900 && seconds <= 1200) {
        return 'Really fucked';
    } else if (seconds > 1500 && seconds <= 1800) {
        return 'Incredibly fucked';
    } else {
        return 'Holy shit is it ever fucked';
    }
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
