var AppDispatcher = require('../dispatchers/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

var AppActions = {

  /**
   * @param  {Object} transport
   */
  addTransport: function(transport){
    AppDispatcher.handleViewAction({
      actionType: AppConstants.ADD_TRANSPORT,
      transport: transport
    });
  },

  /**
   * @param  {Object} transport
   */
  removeTransport: function(transport){
    AppDispatcher.handleViewAction({
      actionType: AppConstants.REMOVE_TRANSPORT,
      transport: transport
    });
  },

  /**
   * @param  {string} type
   */
  updateTransportType: function(type){
    AppDispatcher.handleViewAction({
      actionType: AppConstants.UPDATE_TRANSPORT_TYPE,
      type: type
    });
  }
};

module.exports = AppActions;