'use strict';

var EventEmitter = require('events'),
    Immutable = require('immutable'),
    AppDispatcher = require('../AppDispatcher'),
    AppConstants = require('../AppConstants'),
    TrainStore = require('./TrainStore'),
    LineResources = require('./LineResources'),
    _names = LineResources.getLineNames(),
    _stations = Immutable.Map();

/**
 * Creates stations on update and saves them as a map of line name (colour) to
 * station ID to direction (Northbound/Southbound) to wait time in seconds
 * @param {Immutable Map} route
 * @private
 */
function _createStations(route) {
    var routeName = route.get('route_name');
    var routeStations = Immutable.Map();
    route.get('direction').forEach(function(dir) {
        var direction = dir.get('direction_name');
        dir.get('trip').forEach(function(trip) {
            trip.get('stop').forEach(function(stop) {
                var stopId = stop.get('stop_id');
                var wait = parseInt(stop.get('pre_away'));
                var station = routeStations.get(stopId) || Immutable.Map({
                    name: stop.get('stop_name'),
                    direction: Immutable.Map()
                });
                var existing = station.get('direction');
                if (!existing.has(direction) || existing.get(direction) > wait) {
                    existing = existing.set(direction, wait);
                    station = station.set('direction', existing);
                    routeStations = routeStations.set(stopId, station);
                }
            });
        });
    });
    _stations = _stations.set(routeName, routeStations);
    console.log(_stations.toJS());
}

class StationStore extends EventEmitter {
    constructor() {
        super();
        StationStore.dispatchToken = AppDispatcher.register(
            (action) => {
                switch (action.type) {
                    case AppConstants.UPDATE_ROUTES:
                        AppDispatcher.waitFor([TrainStore.dispatchToken]);
                        _createStations(action.payload);
                        this.emit(AppConstants.CHANGE_EVENT);
                        break;
                    default:
                        //
                }
            }
        );
    }
}

module.exports = new StationStore();
module.exports.dispatchToken = StationStore.dispatchToken;
