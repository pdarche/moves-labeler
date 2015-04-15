var AppDispatcher = require('../dispatchers/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = 'change';

var _transports = [];
var _activeTransports = [];

function populateTransports() {
  $.getJSON('/transports', function(data) {
    _transports = data.map(function(datum) {
      datum.isChecked = false;
      return datum
    });
  });
}

function addTransport(transport) {
  _activeTransports.push(transport);
}

function removeTransport(transport) {
  _activeTransports = _activeTransports.filter(function(trans){
    return trans.num != num;
  });
}

function updateTransportType(type) {
  console.log('I should be updating to', type);
}

var AppStore = assign({}, EventEmitter.prototype, {

  /**
   * Get the entire collection of transports.
   * @return {object}
   */
  getAll: function() {
    return _activeTransports;
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
        addTransport(payload.transport);
        AppStore.emitChange();
        break;

      case AppConstants.REMOVE_TRANSPORT:
        removeTransport(payload.transport);
        AppStore.emitChange();
        break;


      case AppConstants.UPDATE_TRANSPORT_TYPE:
        updateTransportType(payload.type);
        AppStore.emitChange();
        break;
    }

    return true; // No errors. Needed by promise in Dispatcher.
  })

});

module.exports = AppStore;