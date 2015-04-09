var Map = React.createClass({
  getInitialState: function() {
    return {
      mounted: false
    }
  },

  componentDidMount: function() {
    this.map = L.map('map', {
      center: [40.7146, -74],
      zoom: 12
    });

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18
    }).addTo(this.map);

    this.map.on('click', this.onMapClick);
    this.setState({mounted:true})
  },

  updatePoints: function() {
    var lines, points, self = this;

    points = this.props.activeTransports.map(function(trans){
      return trans.trackPoints
    });

    lines = this.createPolyLines(points);

    this.clearMap();

    lines.forEach(function(line){
      line.addTo(self.map)
    });

  },

  createPolyLines: function(pointsArray) {
    var self = this;

    return pointsArray.map(function(trackpoints){
      return self.createPolyLine(trackpoints);
    });
  },

  createPolyLine: function(trackpoints) {
    var points, line;

    points = trackpoints.map(this.createPoint)
    line = new L.Polyline(points, {
                color: 'red',
                weight: 3,
                opacity: 0.5,
                smoothFactor: 1
              });

    return line
  },

  createPoint: function(trackpoint) {
    return new L.LatLng(trackpoint['lat'], trackpoint['lon']);
  },

  clearMap: function() {
    for(i in this.map._layers) {
      if(this.map._layers[i]._path != undefined) {
        try {
            this.map.removeLayer(this.map._layers[i]);
        }
        catch(e) {
            console.log("problem with " + e + this.map._layers[i]);
        }
      }
    }
  },

  componentWillUnmount: function() {
    this.map.off('click', this.onMapClick);
    this.map = null;
  },

  onMapClick: function() {
      // Do some wonderful map things...
  },

  render: function() {
    if (this.state.mounted) this.updatePoints();
    return (
        <div id="map" className='item'></div>
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

var TransportTable = React.createClass({
  getInitialState: function() {
    return {
      isChecked: false
    };
  },

  handleChangeCallback: function(transport) {
    console.log('THE TRANSPORT IS', transport);
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
                <input type="checkbox" onChange={this.toggleActive} checked={this.props.isChecked} />
              </th>
            </tr>
            {transports}
          </table>
        </div>
    );
  }
});

var App = React.createClass({
  getInitialState: function() {
    return {
      transports: [],
      activeTransports: [],
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

  handleToggle: function(num, checkState) {
    var transport, transports;

    if (!checkState) {
      transport = this.state.transports.filter(function(trans){
        return trans.num == num;
      });

      this.setState({
        activeTransports: this.state.activeTransports.concat(transport)
      });

    } else {
      transports = this.state.activeTransports.filter(function(trans){
        return trans.num != num;
      });

      this.setState({
        activeTransports: transports
      });

    }

    console.log(this.state.activeTransports)
  },

  handleToggleAll: function(isChecked) {
    this.state.transports.map(function(trans){
      trans.isChecked = isChecked;
      return trans
    });

    this.setState({
      isChecked: isChecked,
      transports: this.state.transports
    });
  },

  render: function() {
    return(
      <div id="container">
        <div id="map" className="item">
          <Map activeTransports={this.state.activeTransports}/>
        </div>
        <TransportTable
          transports={this.state.transports}
          isChecked={this.state.isChecked}
          onToggleAll={this.handleToggleAll}
          handleToggle={this.handleToggle}/>
      </div>
    );
  }
});


React.render(
  <App/>,
  document.getElementById('app')
);
