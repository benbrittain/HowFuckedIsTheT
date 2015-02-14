'use strict';

var React = require('react'),
    RouteHandler = require('react-router').RouteHandler,
    Footer = require('./Footer.jsx'),
    Home;

Home = React.createClass({
    render: function() {
        return (
                <div>
                    <main>
                        <RouteHandler/>
                    </main>
                    <Footer/>
                </div>
               );
    }
});

module.exports = Home;
