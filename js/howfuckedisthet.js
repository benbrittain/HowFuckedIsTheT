var React = require('react');
var Router = require('react-router');
var { Route, RouteHandler, Link } = Router;

var ButtonToolbar = require('react-bootstrap/ButtonToolbar');
var Button = require('react-bootstrap/Button');

var App = React.createClass({
    mixins: [ Router.Navigation ],
    getInitialState: function () {
        return {
            lines: [
            { name: 'Red', status: 'fucked' },
            { name: 'Orange', status: 'fucked'  },
            { name: 'Green', status: 'fucked'  },
            { name: 'Blue', status: 'fucked'  },
            { name: 'Silver', status: 'fucked'  }
            ]
        };
    },
    render: function () {
        var style = {"color": "red"};
        var links = this.state.lines.map(function (line, i) {
            return (
                    <Link to="line" params={line}>
                        <Button className={"btn-" + line.name}>
                            {line.name}
                        </Button>
                    </Link>
                   );
        });
        return (
                <div className="app">
                            {links}
                    <div className="view">
                        <RouteHandler />
                    </div>
                </div>
               );
    }
});

var Line = React.createClass({
    mixins: [ Router.State ],
    render: function () {
        return (
                <div className="Line">
                    <h1>{this.getParams().name}</h1>
                </div>
               );
    }
});

var routes = (
        <Route handler={App}>
        <Route name="line" path="line/:name " handler={Line}/>
        </Route>
        );

Router.run(routes, Router.HistoryLocation, function (Handler) {
    React.render(<Handler/>, document.getElementById('app'));
});
