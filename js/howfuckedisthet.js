'use strict'

var React = require('react'),
    Router = require('react-router'),
    routes = require('./routes');

Router.run(routes, Router.HistoryLocation, function (Handler) {
    React.render(<Handler/>, document.getElementById('app'));
});

