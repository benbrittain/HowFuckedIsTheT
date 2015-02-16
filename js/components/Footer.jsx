'use strict';

var React = require('react'),
//    Link = require('react-router').Link,
    Footer;

Footer = React.createClass({
    render: function() {
        return (
            <footer>
                <div className="container-fluid">
                    <div className="row">
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-12">
                                    <ul className="list-inline">
                                        <li>
                                            <a href="https://github.com/cavedweller/HowFuckedIsTheT">
                                                Github
                                            </a>
                                        </li>
                                        <li>
                                            Bitcoin Donations: 1GgsubyeX9g8DCxnM9qWSA9JrsnTeZLLG1
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
});

module.exports = Footer;
