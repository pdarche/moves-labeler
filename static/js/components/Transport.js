var Transport = React.createClass({
  getInitialState: function() {
    return {
      type: this.props.type,
      isChecked: false,
      isHighlighted: false
    };
  },

  handleChange: function(ev) {
    this.setState({
      isChecked: !this.state.isChecked,
      isHighlighted: !this.state.isChecked
    });

    this.props.onChange(this.props.num, this.state.isChecked);
  },

  toggleActive: function(ev) {
    this.setState({
      isChecked: !this.state.isChecked,
      isHighlighted: !this.state.isChecked
    });
  },

  onMouseOver: function(ev) {
    this.setState({isHighlighted: true});
  },

  onMouseOut: function(ev) {
    if (!this.state.isChecked){
      this.setState({isHighlighted: false});
    }
  },

  render: function() {
    var classString = "transport"

    if (this.state.isHighlighted || this.props.isChecked) {
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
            <select value={this.props.type} onChange={this.handleChange}>
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
          <input type="checkbox" onChange={this.handleChange} checked={this.state.isChecked || this.props.isChecked}/>
        </td>
      </tr>
    );
  }
});

module.exports = Transport;