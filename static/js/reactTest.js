var App = React.createClass({
  getInitialState: function() {
    return {
      transports: []
    };
  },

  componentDidMount: function() {
    $.getJSON('/transports', function(data) {
      var transports = result[0];
      if (this.isMounted()) {
        this.setState({
          transports: transports
        });
      }
    }.bind(this));
  },

  render: function() {

  }
});


var Livemap = React.createClass({
    componentDidMount: function() {
      var map = this.map = L.map(this.getDOMNode(), {
          minZoom: 2,
          maxZoom: 20,
          layers: [
              L.tileLayer(
                  'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                  {attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'})
          ],
          attributionControl: false,
      });

      map.on('click', this.onMapClick);
      map.fitWorld();
    },
    componentWillUnmount: function() {
        this.map.off('click', this.onMapClick);
        this.map = null;
    },
    onMapClick: function() {
        // Do some wonderful map things...
    },
    render: function() {
        return (
            <div id="map" className='map'></div>
        );
    }
});


var Transport = React.createClass({
  getInitialState: function() {
    return {
      type: this.props.type,
      isChecked: false,
      isHighlighted: false
    };
  },

  handleChange: function(ev) {
    this.props.onChange(this);
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
          <input type="checkbox" onChange={this.toggleActive} checked={this.state.isChecked || this.props.isChecked}/>
        </td>
      </tr>
    );
  }
});

var TransportTable = React.createClass({
  getInitialState: function() {
    return {
      transports: [],
      isChecked: false
    };
  },

  componentDidMount: function() {
    $.getJSON('/transports', function(data) {
      var transports = data.map(function(datum) {
        datum.isChecked = false;
        return datum
      });

      if (this.isMounted()) {
        this.setState({
          transports: transports
        });
      }
    }.bind(this));
  },

  handleChangeCallback: function(transport) {
    console.log('THE TRANSPORT IS', transport);
  },

  toggleActive: function(ev) {
    var isChecked = !this.state.isChecked;
    this.setState({
      isChecked: isChecked,
      transports: this.state.transports.map(function(trans){
        trans.isChecked = isChecked
        return trans
      })
    });
  },

  render: function() {
    var transports = this.state.transports.map(function(trans) {
      return <Transport
              num={trans.num}
              date={trans.date}
              start={trans.start}
              end={trans.end}
              distance={trans.distance}
              duration={trans.duration}
              type={trans.type}
              isChecked={trans.isChecked}
              onChange={this.handleChangeCallback}/>;
    }.bind(this));

    return (
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
              <input type="checkbox" onChange={this.toggleActive} checked={this.state.isChecked} />
            </th>
          </tr>
          {transports}
        </table>
    );
  }
})


React.render(
  <TransportTable/>,
  document.getElementById('transport_list')
);

