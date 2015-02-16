'use strict'

var React = require('react'),
    Router = require('react-router'),
    mbta = require('./mbta'),
    routes = require('./routes')


mbta.start();

Router.run(routes, function (Handler) {
    React.render(<Handler/>, document.body);
});

