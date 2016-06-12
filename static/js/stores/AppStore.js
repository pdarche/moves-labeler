var AppActions = require('../actions/AppActions')
var AppDispatcher = require('../dispatchers/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = 'change';

var _transports = [];
var _activeTransports = [];

function populateTransports() {
  $.getJSON('/transports')
    .done(function(data) {
      _transports = data;
      AppActions.handlePopulateSuccess(data);
    })
    .fail(function(err){
      AppActions.handlePopulateError(err);
    });
}

function addTransport(num) {
  _activeTransports.push(_transports[num]);
}

function removeTransport(num) {
  _activeTransports = _activeTransports.filter(function(trans){
    return trans.num != num;
  });
}

function updateTransportType(id, type) {
  var data, transport;

  transport = _.where(_transports, {id:id});
  transport[0].type = type;
  data = JSON.stringify({id: id, type: type});

  $.ajax({
    url:'/transport',
    method: 'PUT',
    data: data
  })
  .done(function(){
    AppActions.handlePopulateSuccess(data);
  })
  .fail(function(){
    AppActions.handlePopulateError(err);
  });
}

function sortTransports(key, direction) {
  console.log('they key and direction are', [key, direction]);
}

var AppStore = assign({}, EventEmitter.prototype, {

  /**
   * Get the entire collection of active transports.
   * @return {array}
   */
  getAllActive: function() {
    return _activeTransports;
  },

  /**
   * Get the entire collection of transports.
   * @return {array}
   */
  getAllTransports: function() {
    return _transports;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  dispatcherIndex: AppDispatcher.register(function(payload) {
    var action = payload.action;

    switch(action.actionType) {
      case AppConstants.ADD_TRANSPORT:
        addTransport(action.transport);
        AppStore.emitChange();
        break;

      case AppConstants.REMOVE_TRANSPORT:
        removeTransport(action.transport);
        AppStore.emitChange();
        break;

      case AppConstants.UPDATE_TRANSPORT_TYPE:
        updateTransportType(action.id, action.type);
        AppStore.emitChange();
        break;

      case AppConstants.POPULATE_TRANSPORTS:
        populateTransports();
        AppStore.emitChange();
        break;

      case AppConstants.SORT_TRANSPORTS:
        sortTransports(action.key, action.direction);
        AppStore.emitChange();

      case AppConstants.POPULATION_SUCCESS:
        AppStore.emitChange();
        break;

      case AppConstants.POPULATION_ERROR:
        AppStore.emitChange();
        break;
    }

    return true; // No errors. Needed by promise in Dispatcher.
  })

});

module.exports = AppStore;