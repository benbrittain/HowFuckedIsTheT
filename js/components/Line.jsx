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
        var children = this.props.station.get('next_stations');
        var subStationTree= children.map(nextStation =>
                <StationTree station={nextStation}
                             xscale={this.props.xscale}
                             yscale={this.props.yscale} />
                ).toJS();

        var xscale = parseInt(this.props.xscale);
        var yscale = parseInt(this.props.yscale);
        var x = xscale * parseInt(this.props.station.get('x'));
        var y = yscale * parseInt(this.props.station.get('y'));
        var name = this.props.station.get('name');
        return(
                <svg>
                {children.map(nextStation =>
                        <TrainLine xs={x} ys={y}
                                   xe={parseInt(nextStation.get('x')) * xscale}
                                   ye={parseInt(nextStation.get('y')) * yscale} />
                        ).toJS()}
                <Station x={x} y={y} name={name} />
                {subStationTree}
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

    render: function() {
        var stations = LineResources.getStations(this.getParams().colour);
        var style = {'border': '5px solid black'}
        var yscale = 100;
        var xscale = 300;

        var colour = stations.get('colour');
        var station = stations.get('root');

        return (
                <div>
                    <div>
                        <LineSVG height="2200" width="800" style={style}>
                            <StationTree xscale={xscale} yscale={yscale} station={station} colour={colour}>
                            </StationTree>
                        </LineSVG>
                    </div>
                </div>);
    }
});

module.exports = Line;
