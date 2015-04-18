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

module.exports = Map;
