'use strict';

var React = require('react'),
    { Route, DefaultRoute, Link, RouteHandler } = require('react-router'),
    { Home, Line, LineDashboard } = require('./components/Components')


module.exports = (
    <Route name="home" path="/" handler={Home}>
        <DefaultRoute handler={LineDashboard}/>
        <Route name="line" path="line/:colour" handler={Line} />
    </Route>
);
