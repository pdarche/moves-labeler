var Transport = require('./Transport');
var AppActions = require('../actions/AppActions')

var TransportTable = React.createClass({

  getInitialState: function() {
    return {
      checked: false,
      sortAscending: true,
      sortKey: 'num'
    };
  },

  toggleAll: function() {
    // AppActions.toggleAll()
    this.setState({checked: !this.state.checked});
  },

  toggleActive: function(ev) {
    var checked = !this.props.checked;
    this.props.onToggleAll(this.props.num, checked);
  },

  handleSort: function(ev) {
    var key = ev.target.id;

    this.setState({
      sortAscending: !this.state.sortAscending,
      sortKey: key
    });

    // AppActions.sortTransports(id, direction);
  },

  componentWillUpdate: function(nextProps, nextState) {
    var key = nextState.sortKey;
    var nextTransports = _.sortBy(nextProps.transports, function(t){ return t[key]; });
    this.props = {transports: nextTransports};
  },

  render: function() {
    var transports = this.props.transports.map(function(trans) {
      return <Transport
              id={trans.id}
              hash={trans.hash}
              num={trans.num}
              date={trans.date}
              start={trans.start}
              end={trans.end}
              distance={trans.distance}
              duration={trans.duration}
              pred={trans.pred}
              type={trans.type}
              checked={trans.checked}/>;
    }.bind(this));

    return (
        <div id="transport_list">
          <table>
            <tr>
              <th id="num" onClick={this.handleSort}>Index</th>
              <th id="date" onClick={this.handleSort}>Date</th>
              <th id="start" onClick={this.handleSort}>Start Time</th>
              <th id="end" onClick={this.handleSort}>End Time</th>
              <th id="distance" onClick={this.handleSort}>Distance</th>
              <th id="duration" onClick={this.handleSort}>Duration</th>
              <th id="pred" onClick={this.handleSort}>Pred</th>
              <th id="type" onClick={this.handleSort}>Type</th>
              <th>
                <input type="checkbox" onChange={this.toggleAll} checked={this.state.checked} />
              </th>
            </tr>
            {transports}
          </table>
        </div>
    );
  }
});

module.exports = TransportTable;
