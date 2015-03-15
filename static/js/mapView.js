var MapView = Backbone.View.extend({
  initialize: function() {
    this.map = L.map('map', {
      center: [40.7146, -74],
      zoom: 12
    });

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18
    }).addTo(this.map);

    this.collection.bind('add', $.proxy(this.render, this));
    this.collection.bind('remove', $.proxy(this.render, this));
  },

  render: function() {
    var points = this.collection.pluck('trackPoints')
      , lines = this.createPolyLines(points)
      , self = this;

    this.clearMap();
    lines.forEach(function(line){
      line.addTo(self.map)
    });
  },

  createPoint: function(trackpoint) {
    return new L.LatLng(trackpoint['lat'], trackpoint['lon']);
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

  createPolyLines: function(pointsArray) {
    var self = this;

    return pointsArray.map(function(trackpoints){
      return self.createPolyLine(trackpoints);
    });
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
  }
});
