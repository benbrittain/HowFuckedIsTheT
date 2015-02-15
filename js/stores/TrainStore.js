'use strict';

var EventEmitter = require('events'),
    Immutable = require('immutable'),
    AppDispatcher = require('../AppDispatcher'),
    AppConstants = require('../AppConstants'),
    LineResources = require('./LineResources'),
    _trains = Immutable.Map();

/**
 * Create the Trains object which contains the status of all Trains
 * @param {Immutable Map} trainLine
 * @private
 */
function _updateTrains(trainLine) {
    var name = trainLine.get('route_name');
    var line = _trains.get(name);
    if (line) {
        var l = line.push(trainLine);
    } else {
        var l = Immutable.List().push(trainLine);
    }
    _trains = _trains.set(name, l);
}

/**
 * Creating the store with the sweet new ES6 class syntax.
 */
class TrainStore extends EventEmitter {
    constructor() {
        super();
        TrainStore.dispatchToken = AppDispatcher.register(
                (action) => {
                    switch (action.type) {
                        case AppConstants.UPDATE_ROUTES:
                            console.log('updating routes');
                            _updateTrains(action.payload);
                            this.emit(AppConstants.CHANGE_EVENT);
                            break;
                        default:
                            // whatevs, we got multiple stores like cool kids
                    }
                });
    }

    getTrainLines() {
        return _trains;
    }
}

module.exports = new TrainStore();
module.exports.dispatchToken = TrainStore.dispatchToken;
