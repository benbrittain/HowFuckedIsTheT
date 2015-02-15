'use strict';

var Immutable = require('immutable'),
    AppDispatcher = require('./AppDispatcher'),
    ActionCreators = require('./ActionCreators'),
    AppConstants = require('./AppConstants');

function updateRoute(response) {
    response = JSON.parse(response);
    var resp = Immutable.fromJS(response);
    ActionCreators.fire(AppConstants.UPDATE_ROUTES, resp);
}

function receiveRoutes(response) {
    var resp = Immutable.Map();
    var modes = Immutable.fromJS(response).get('mode');
    modes.map(function(m){
        var routes = m.get('route');
        routes.map(function(x) {
            // TODO there must be a better way with Immutable...
            // some sorta update/mergeIn??
            var name = x.get('route_name');
            var id = x.get('route_id');
            var route = resp.get(name);
            if (route) {
                var l = route.push(id);
            } else {
                var l = Immutable.List().push(id);
            }
            resp = resp.set(name, l);
        });
    });
    ActionCreators.fire(AppConstants.LOAD_ROUTES, resp);
}

module.exports.receiveRoutes = receiveRoutes;
module.exports.updateRoute = updateRoute;
