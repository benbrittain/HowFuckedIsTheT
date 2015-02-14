var API_KEY = "wX9NwuHnZU2ToO7GmGR9uw";

var normalizr = require('normalizr'),
    normalize = normalizr.normalize,
    Schema = normalizr.Schema,
    arrayOf = normalizr.arrayOf;

function getRoutes(cb) {
    var URL = "http://realtime.mbta.com/developer/api/v2/routes?api_key="
        + API_KEY + "&format=json";
    var req = new XMLHttpRequest();
    req.onload = function(res) {
        cb.call(req.response);
    }
    req.open("get", URL, true);
    req.send();
}


module.exports.API_KEY = API_KEY;
module.exports.getRoutes = getRoutes;
