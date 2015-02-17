'use strict';

var React = require('react'),
    Router = require('react-router'),
    Immutable = require('immutable'),
    AppConstants = require('../AppConstants'),
    ActionCreators = require('../ActionCreators'),
    TrainStore = require('../stores/TrainStore'),
    LineStore = require('../stores/LineStore'),
    LineResources = require('../stores/LineResources'),
    Line;

function getState() {
    // Maybe only grab the colour?
    return {
        lines: LineStore.getLines(),
        trains: TrainStore.getTrainLines(),
        trainsAtStations: TrainStore.getTrainsAtStations()
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
        return( <line {...this.props} strokeWidth="20" stroke="red" />)
    }
});

var Train = React.createClass({
    render: function() {
        return ( <rect height="50" width="50" {...this.props} >{this.props.children}</rect>)
    }
});


var StationTree = React.createClass({
    render: function() {
        var { station, ...other } = this.props;
        var trainsAtStations = this.props.trainsAtStations;


        var children = this.props.station.get('next_stations');
        var x = this.props.xscale * parseInt(station.get('x'));
        var y = this.props.yscale * parseInt(station.get('y'));
        var name = station.get('name');

        var subStationTree = children.map(nextStation =>
                <StationTree station={nextStation} {...other} />);
        var trainLines = children.map(nextStation =>
                        <TrainLine x1={x} y1={y}
                                   x2={parseInt(nextStation.get('x')) * this.props.xscale}
                                   y2={parseInt(nextStation.get('y')) * this.props.yscale} />
                        );

        var trains = Immutable.Map();
        var station = trainsAtStations.get(name);
        if (station) {
            trains = station.map(function(train, offset) {
                console.log("MAKIN A TRAIN");
                var x = this.props.xscale * parseInt(this.props.station.get('x'));
                var y = this.props.yscale * parseInt(this.props.station.get('y'));
                console.log(x);
                console.log(y);
                return (<Train x={x - 100} y={y} />)
            }, this);
        }

        return(
                <svg>
                    {trainLines.toJS()}
                    <Station x={x} y={y} name={name} />
                    {trains.toJS()}
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
                        <LineSVG height="2200" width="1800" style={style}>
                            <StationTree
                                xscale={xscale}
                                yscale={yscale}
                                trainsAtStations={this.state.trainsAtStations}
                                station={station} colour={colour} />
                        </LineSVG>
                    </div>
                </div>);
    }
});

module.exports = Line;
