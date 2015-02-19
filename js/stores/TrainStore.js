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
function _whatStationToPlaceTrainsAt(route) {
    var routeName = route.get('route_name');
    route.get('direction').forEach(function(dir) {
        var direction = dir.get('direction_name');
        dir.get('trip').forEach(function(trip) {
            var nextStop = trip.get('stop').first();
            var name = nextStop.get('stop_name');
            var nameArr = name.split('-');
            if (nameArr.length > 1) {
                name = nameArr[0].trim();
            }
            var trains = _trainsAtStations.get(name) || Immutable.List();
            trains = trains.push(Immutable.Map({
                wait: parseInt(nextStop.get('pre_away')),
                direction: direction,
                route: routeName
            }));
            _trainsAtStations = _trainsAtStations.set(name, trains);
        });
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
