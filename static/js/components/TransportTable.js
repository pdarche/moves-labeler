var Transport = require('./Transport');

var TransportTable = React.createClass({

  getInitialState: function() {
    return {
      isChecked: false
    };
  },

  toggleAll: function() {
    this.props.onToggleAll();
  },

  toggleActive: function(ev) {
    var isChecked = !this.props.isChecked;
    this.props.onToggleAll(this.props.num, isChecked);
  },

  render: function() {
    var transports = this.props.transports.map(function(trans) {
      return <Transport
              num={trans.num}
              date={trans.date}
              start={trans.start}
              end={trans.end}
              distance={trans.distance}
              duration={trans.duration}
              type={trans.type}
              isChecked={trans.isChecked}
              onChange={this.props.handleToggle}/>;
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
                <input type="checkbox" onChange={this.toggleAll} checked={this.props.isChecked} />
              </th>
            </tr>
            {transports}
          </table>
        </div>
    );
  }
});

module.exports = TransportTable;
