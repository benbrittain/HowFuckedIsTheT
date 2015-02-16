'use strict';

var React = require('react'),
    Header;

Header = React.createClass({
    render: function() {
        return (
                <header className="navbar navbar-default navbar-fixed-top">
                    <div className="container">
                        <div className="navbar-header">
                            <a className="navbar-brand" href="#">
                                How Fucked is the &#9417;?
                            </a>
                        </div>
                    </div>
                </header>
               );
    }
});

module.exports = Header;
