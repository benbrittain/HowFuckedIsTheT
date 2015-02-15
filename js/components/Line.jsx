'use strict';

var React = require('react'),
    Router = require('react-router'),
    AppConstants = require('../AppConstants'),
    ActionCreators = require('../ActionCreators'),
    LineStore = require('../stores/LineStore'),
    Immutable = require('immutable'),
    Line;

function getState() {
    // Maybe only grab the colour?
    return {
        lines: LineStore.getLines()
    };
}


var LineSVG = React.createClass({
        render: function() {
            return this.transferPropsTo(<svg>{this.props.children}</svg>);
        }
});


var Station = React.createClass({
    render: function() {
        return (
                <svg>
                    <text x={this.props.x + 30} y={this.props.y}>
                        {this.props.name}
                    </text>
                    <circle cx={this.props.x} cy={this.props.y} r="25"> station </circle>
                </svg>
                );
    }
});

var TrainLine = React.createClass({
    render: function() {
        return(
                <line x1={this.props.xs} y1={this.props.ys} x2={this.props.xe} y2={this.props.ye}
                    strokeWidth="20"
                    stroke="red" />
              )
    }
});

var stations = Immutable.List();
stations = stations.push(Immutable.Map({name: 'MIT/Kendall', x: 30, y: 80}));
stations = stations.push(Immutable.Map({name: 'Central', x: 30, y: 400}));
stations = stations.push(Immutable.Map({name: 'Harvard', x: 30, y: 600}));

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
        return (
                <div>
                    <div>
                        showing a map for { this.getParams().colour}
                        <LineSVG height="800" width="800">
                            {
                                stations.map(function(station, idx) {
                                    var nextStation = stations.get(idx+1);
                                    if (nextStation) {
                                        return (<TrainLine
                                                   xs={station.get('x')}
                                                   ys={station.get('y')}
                                                   xe={nextStation.get('x')}
                                                   ye={nextStation.get('y')} />)
                                    }
                                }).toJS()
                            }
                            {
                                stations.map(station =>
                                        <Station name={station.get('name')}
                                                 x={station.get('x')}
                                                 y={station.get('y')} />).toJS()
                            }
                        </LineSVG>
                    </div>
                </div>);
    }
});

module.exports = Line;
