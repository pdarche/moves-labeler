var Transport = require('./Transport');

var TransportTable = React.createClass({

  getInitialState: function() {
    return {
      checked: false
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

  render: function() {
    var transports = this.props.transports.map(function(trans) {
      return <Transport
              id={trans.id}
              num={trans.num}
              date={trans.date}
              start={trans.start}
              end={trans.end}
              distance={trans.distance}
              duration={trans.duration}
              type={trans.type}
              checked={trans.checked}/>;
    }.bind(this));

    return (
        <div id="transport_list">
          <table>
            <tr>
              <th>Index</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Distance</th>
              <th>Duration</th>
              <th>Type</th>
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
