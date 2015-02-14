'use strict';

var React = require('react'),
    Router = require('react-router'),
    AppConstants = require('../AppConstants'),
    ActionCreators = require('../ActionCreators'),
    LineStore = require('../stores/LineStore'),
    Line;

function getState() {
    // Maybe only grab the colour?
    return {
        lines: LineStore.getLines()
    };
}

Line = React.createClass({
    mixins: [ Router.State ],

    getInitialState: function() {
        return getState();
    },

    componentDidMount: function() {
        LineStore.on(AppConstants.CHANGE_EVENT, this._onChange);
    },

    componentWillUnmount: function() {
        LineStore.removeListener(AppConstants.CHANGE_EVENT, this._onChange);
    },

    _onChange: function() {
        this.setState(getState());
    },

    render: function() {
        return ( <div> showing a map for { this.getParams().colour} </div>);
    }
});

module.exports = Line;
