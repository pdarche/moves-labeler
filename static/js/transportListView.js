var TransportListView = Backbone.View.extend({
  initialize: function() {
    var self = this;

    $.when(
      $.get('/static/js/transportList.handlebars')
      )
      .done(function(tmpl){
        self.tmpl = tmpl;
        self.render();
        self.collection.models.forEach(function(model){
          self.filterDdpSelect(model);
        });
      });

  },

  render: function() {
    var source = $(this.tmpl).html()
      , template = Handlebars.compile(source)
      , data = this.collection.toJSON()

    this.$el.append(template({transports: data}));
  },

  events: {
    "click .transport, .activator": "activateTransport",
    "mouseover .transport": "mouseOver",
    "mouseout .transport": "mouseOut",
    "change .type" : "updateType",
  },

  filterDdpSelect: function(model){
    var selectValue = model.get('type')
      , selector = '#' + model.get('id') + ' option[value="' + selectValue + '"]'

    $(selector).attr("selected", "selected");
  },

  mouseOver: function(ev) {
    $(ev.target).parent().addClass('hovering');
  },

  mouseOut: function(ev) {
    $(ev.target).parent().removeClass('hovering');
  },

  activateTransport: function(ev) {
    var target = $(ev.target).parent()
      , index = target.index()
      , id = target.attr('id')
      , model = this.collection.byId(id)

    if (target.hasClass('active')) {
      target.removeClass('active');
      target.find('.activator').attr('checked', false);
      vent.trigger('removeModel', id);
    } else {
      target.addClass('active');
      target.find('.activator').attr('checked', true);
      vent.trigger('addModel', id);
    }
  },

  updateType: function(ev){
    var target = $(ev.target)
      , newType = target.find('option:selected').attr('value')
      , id = target.parent().parent().attr('id')
      , model = this.collection.byId(id);

    model.set('type', newType);
    model.save();
  }
});