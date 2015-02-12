var React = require('react');
var Router = require('react-router');
var { Route, RouteHandler, Link } = Router;

var App = React.createClass({
    mixins: [ Router.Navigation ],
    getInitialState: function () {
        return {
            lines: [
            { name: 'Red' },
            { name: 'Orange' },
            { name: 'Green' },
            { name: 'Blue' },
            { name: 'Silver' }
            ]
        };
    },
    render: function () {
        var links = this.state.lines.map(function (line, i) {
            return (
                    <li key={i}>
                        <Link to="line" params={line}>{line.name}</Link>
                    </li>
                   );
        });
        return (
                <div className="app">
                    <ul className="nav">
                        {links}
                    </ul>
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
