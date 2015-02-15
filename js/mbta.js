var API_KEY = "wX9NwuHnZU2ToO7GmGR9uw";

var ServerActionCreators = require('./ServerActionCreators'),
    AppConstants = require('./AppConstants');

/**
 * Load all the naming conventions that MBTA v2.0 API uses
 */
function getRoutes() {
    // TODO check if need to bypass cache
    var URL = "http://realtime.mbta.com/developer/api/v2/routes?api_key=" + API_KEY + "&format=json";
    var req = new XMLHttpRequest();
    req.onload = function(res) {
        ServerActionCreators.receiveRoutes(this.response);
    }
    req.open("get", URL, true);
    req.send();
}


function getRouteStatus(route) {
    var URL = "http://realtime.mbta.com/developer/api/v2/predictionsbyroute?api_key=" + API_KEY +
        "&route=" + route + "&format=json";

    var req = new XMLHttpRequest();
    req.onload = function(res) {
        ServerActionCreators.updateRoute(this.response);
    }

    req.open("get", URL, true);
    req.send();
}

/**
 * Initialize the polling for MBTA changes
 */
function start() {
    getRoutes();
    getRouteStatus("931_");
//    getDelays();
//    setInterval(, 60000); 2
}

module.exports.start = start;
module.exports.getRoutes = getRoutes;
