'use strict';

var EventEmitter = require('events'),
    Immutable = require('immutable'),
    AppDispatcher = require('../AppDispatcher'),
    AppConstants = require('../AppConstants'),
    LineResources = require('./LineResources'),
    _trains = Immutable.Map(),
    _trains = _makeSomeTrainLines(_trains);


function _makeSomeTrainLines(trains) {
    _trains = trains;
}

/**
 * Create the Trains object which contains the Name of the Line, MBTA id
 * and status of the line in the private Store
 * @param {Immutable Map} trainLines
 * @private
 */
function _updateTrains(trainLines) {
    console.log(trainLines);
    _trains = trainLines;
}

/**
 * Creating the store with the sweet new ES6 class syntax.
 */
class TrainStore extends EventEmitter {
    constructor() {
        super();
        TrainStore.dispatchToken = AppDispatcher.register(
                (action) => {
                    console.log(action);
                    switch (action.type) {
                        case AppConstants.UPDATE_ROUTES:
                            console.log('updates in trainstore');
                            _updateTrains(action.payload);
                            this.emit(AppConstants.CHANGE_EVENT);
                            break;
                        default:
                            // whatevs, we got multiple stores like cool kids
                    }
                });
    }

    getTrains() {
        return _trains;
    }
}

module.exports = new TrainStore();
module.exports.dispatchToken = TrainStore.dispatchToken;
