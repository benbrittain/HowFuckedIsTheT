'use strict';

var React = require('react'),
    RouteHandler = require('react-router').RouteHandler,
    Header = require('./Header.jsx'),
    Footer = require('./Footer.jsx'),
    Home;

Home = React.createClass({
    render: function() {
        return (
            <div>
                <Header/>
                <div id="main" className="container-fluid">
                    <RouteHandler/>
                </div>
                <Footer/>
            </div>
        );
    }
});

module.exports = Home;
