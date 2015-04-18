var AppActions = require('../actions/AppActions');

var Transport = React.createClass({
  getInitialState: function() {
    return {
      type: this.props.type,
      checked: this.props.checked || false,
      highlighted: false
    };
  },

  handleTypeChange: function(ev) {
    AppActions.updateTransportType(this.props.id, ev.target.value);
  },

  handleActiveChange: function() {
    if (!this.state.checked) {
      AppActions.addTransport(this.props.num);
    } else {
      AppActions.removeTransport(this.props.num);
    }
    this.setState({checked: !this.state.checked})
  },

  onMouseOver: function(ev) {
    this.setState({highlighted: true});
  },

  onMouseOut: function(ev) {
    if (!this.state.checked){
      this.setState({highlighted: false});
    }
  },

  render: function() {
    var classString = "transport"

    if (this.state.highlighted || this.state.checked) {
      classString += " active"
    }

    return (
      <tr className={classString} onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut}>
        <td>{this.props.num}</td>
        <td>{this.props.date}</td>
        <td>{this.props.start}</td>
        <td>{this.props.end}</td>
        <td>{this.props.distance}</td>
        <td>{this.props.duration}</td>
        <td>
            <select value={this.props.type} onChange={this.handleTypeChange}>
                <option value=""></option>
                <option value="airplane">Airplane</option>
                <option value="bike">Bike</option>
                <option value="boat">Boat</option>
                <option value="bus">Bus</option>
                <option value="car">Car</option>
                <option value="scooter">Scooter</option>
                <option value="subway">Subway</option>
                <option value="train">Train</option>
            </select>
        </td>
        <td>
          <form>
            <input type="checkbox" onChange={this.handleActiveChange} checked={this.props.checked || this.state.checked}/>
          </form>
        </td>
      </tr>
    );
  }
});

module.exports = Transport;