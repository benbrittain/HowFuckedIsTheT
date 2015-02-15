//TODO change this key, maybe use several?
var API_KEY = "wX9NwuHnZU2ToO7GmGR9uw";

var ServerActionCreators = require('./ServerActionCreators'),
    AppConstants = require('./AppConstants'),
    LineStore = require('./stores/LineStore');

/**
 * Load all the naming conventions that MBTA v2.0 API uses
 * @private
 */
function getRoutes() {
    // TODO check if need to bypass cache
    var URL = "http://realtime.mbta.com/developer/api/v2/routes?api_key=" + API_KEY + "&format=json";
    var req = new XMLHttpRequest();
    req.onload = function(res) {
        ServerActionCreators.receiveRoutes(this.response);
        getRouteStatuses();
    }
    req.open("get", URL, true);
    req.send();
}

/**
 * Load all the train locations for a particular route
 * @param {String} mbtaRouteId
 * @private
 */
function getRouteStatus(mbtaRouteId) {
    var URL = "http://realtime.mbta.com/developer/api/v2/predictionsbyroute?api_key=" + API_KEY +
        "&route=" + mbtaRouteId + "&format=json";

    var req = new XMLHttpRequest();
    req.onload = function(res) {
        ServerActionCreators.updateRoute(this.response);
    }

    req.open("get", URL, true);
    req.send();
}

/**
 * Cycle through all the loaded lines and request their route statuses
 * @private
 */
function getRouteStatuses() {
    var lines = LineStore.getLines();
    lines.map(line => line.get('ids').map(id => getRouteStatus(id)));
}

/**
 * Initialize the polling for MBTA changes
 */
function start() {
    getRoutes();
    // lame wait function for testing
//    setTimeout(function(){
//        getRouteStatuses();
//    }, 500);

//    setInterval(getRouteStatuses, 600);
}

module.exports.start = start;
