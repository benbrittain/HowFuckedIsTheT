'use strict';

var React = require('react'),
    Router = require('react-router'),
    Immutable = require('immutable'),
    AppConstants = require('../AppConstants'),
    ActionCreators = require('../ActionCreators'),
    LineStore = require('../stores/LineStore'),
    LineResources = require('../stores/LineResources'),
    Line;

function getState() {
    // Maybe only grab the colour?
    return {
        lines: LineStore.getLines()
    };
}


var LineSVG = React.createClass({
        render: function() {
            return (<svg {...this.props}>{this.props.children}</svg>);
        }
});


var Station = React.createClass({
    render: function() {
        return (
                <svg>
                    <text x={this.props.x + 50} y={this.props.y}>{this.props.name}</text>
                    <circle cx={this.props.x} cy={this.props.y} r="25"> station </circle>
                </svg>
                );
    }
});

var TrainLine = React.createClass({
    render: function() {
        return(
                <line x1={this.props.xs}
                      y1={this.props.ys}
                      x2={this.props.xe}
                      y2={this.props.ye}
                      strokeWidth="20"
                      stroke="red" />
              )
    }
});


var StationTree = React.createClass({
    render: function() {
        var { station, ...other } = this.props;

        var children = this.props.station.get('next_stations');
        var x = this.props.xscale * parseInt(station.get('x'));
        var y = this.props.yscale * parseInt(station.get('y'));
        var name = station.get('name');

        var subStationTree = children.map(nextStation =>
                <StationTree station={nextStation} {...other} />);
        var trainLines = children.map(nextStation =>
                        <TrainLine xs={x} ys={y}
                                   xe={parseInt(nextStation.get('x')) * this.props.xscale}
                                   ye={parseInt(nextStation.get('y')) * this.props.yscale} />
                        );
        return(
                <svg>
                {trainLines.toJS()}
                <Station x={x} y={y} name={name} />
                {subStationTree.toJS()}
                </svg>
              )
    }
});

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

    /**
     * @param {Immutable Map} station
     * @param {Number} size
     * @return {Number}
     */
    treeSize: function(station, size) {
        if (station === undefined) { return size; }
        var children = station.get('next_stations');
        if (children && children.size > 0) {
            return children.map(function(branch) {
                return this.treeSize(branch, size + 1);
            }, this).max();
        } else {
            return size;
        }
    },

    render: function() {
        var stations = LineResources.getStations(this.getParams().colour);
        var style = {'border': '5px solid black'}
        var yscale = 100;
        var xscale = 300;

        var colour = stations.get('colour');
        var station = stations.get('root');

        var width = window.innerWidth - 40;
        var height = this.treeSize(station, 1) * 105;

        return (
                <div>
                    <div>
                        <LineSVG height={height} width={width} style={style}>
                            <StationTree xscale={xscale} yscale={yscale} station={station} colour={colour} />
                        </LineSVG>
                    </div>
                </div>);
    }
});

module.exports = Line;
