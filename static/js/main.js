var TransportModel = Backbone.Model.extend({
  url: '/transport'
});

var TransportCollection = Backbone.Collection.extend({
  url: '/transports',
  model: TransportModel,
  byId: function(id) {
      filtered = this.filter(function(model) {
        return model.get("id") === id;
        });

      return filtered[0]
    }
});

$(document).ready(function(){
  vent = _.extend({}, Backbone.Events);
  transports = new TransportCollection();
  mapTransports = new Backbone.Collection();

  transports.fetch();

  var mapView = new MapView({
    el: '#map',
    collection: mapTransports
  });

  // var transportList = new TransportListView({
  //   el: '#transport_list',
  //   collection: transports
  // });

  // vent.on('addModel', function(id){
  //   mapTransports.add(transports.byId(id));
  // });

  // vent.on('removeModel', function(id){
  //   mapTransports.remove(transports.byId(id));
  // });

});

