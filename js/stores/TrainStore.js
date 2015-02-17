'use strict';

var EventEmitter = require('events'),
    Immutable = require('immutable'),
    AppDispatcher = require('../AppDispatcher'),
    AppConstants = require('../AppConstants'),
    LineResources = require('./LineResources'),
    Utils = require('../utils'),
    _trains = Immutable.Map(),
    _trainsAtStations = Immutable.Map();

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
 * Create the stations object which contains the train at each station
 * @param {Immutable Map} trainLine
 * @private
 */
function _whatStationToPlaceTrainsAt(trainLine) {
    var name = trainLine.get('route_name');
    _trains.get(name).map(function(linepart) {
            linepart.get('direction').map(function(direction) {
                var heading = direction.get('direction_name');
                direction.get('trip').map(function(train) {
                    var nextStop = train.get('stop').first();
                    var name = nextStop.get('stop_name');
                    var timeAway = nextStop.get('pre_away');
                    var trainData = Immutable.Map({
                        timeAway: timeAway,
                        direcion: heading
                    });
                    var nameArr = name.split('-');
                    if (nameArr.length > 1) {
                        name = nameArr[0].trim();
                    }
                    var station = _trainsAtStations.get(name);
                    if (station) {
                        var l = station.push(trainData)
                    } else {
                        var l = Immutable.List().push(trainData);
                    }
                    _trainsAtStations = _trainsAtStations.set(name, l);
                })
            })
    });
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
                            _updateTrains(action.payload);
                            _whatStationToPlaceTrainsAt(action.payload);
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

    getTrainsAtStations() {
        return _trainsAtStations;
    }
}

module.exports = new TrainStore();
module.exports.dispatchToken = TrainStore.dispatchToken;
