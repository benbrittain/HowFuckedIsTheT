'use strict';
var React = require('react'),
    Router = require('react-router'),
    { Route, Redirect, RouteHandler, Link } = Router,
    AppConstants = require('../AppConstants'),
    LineStore = require('../stores/LineStore'),
    Line = require('./Line.jsx'),
    LineDashboard;

function getState() {
    return {
        lines: LineStore.getLines()
    };
}

var LineLine = React.createClass({
    propTypes: {
        name: React.PropTypes.string,
        status: React.PropTypes.string
    },

    render: function() {
        var name = this.props.name;
        var status = this.props.status;
        var wait = this.props.wait;
        return(
            <div className={"row line-" + name}>
                <div className="container">
                    <div className="row">
                        <div className="col-sm-6 line-title">
                            <h2>{name}</h2>
                        </div>
                        <div className="col-sm-6 line-info">
                            <div className="row">
                                <div className="col-sm-12 col-xs-6">
                                    <p className="status">
                                        {status}
                                    </p>
                                </div>
                                <div className="col-sm-12 col-xs-6">
                                    <p className="wait">
                                        Avg wait {wait}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

LineDashboard = React.createClass({
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
        var lines = this.state.lines.map(line =>
                <Link to="line" params={{'colour': line.get('name')}}>
                    <LineLine name={line.get('name')} status={line.get('fuckedness')} wait={line.get('wait')} />
                </Link>
                ).toArray();
        //TODO upgrade to 13 so toArray is unnecessary
        return (
                <div id="lines">
                        { lines }
                </div>
               );
    }
});

module.exports = LineDashboard;
