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
  updateTransportType: function(id, type){
    AppDispatcher.handleViewAction({
      actionType: AppConstants.UPDATE_TRANSPORT_TYPE,
      id: id,
      type: type
    });
  },

  /**
   * @param  {string} type
   */
  populateTransports: function() {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.POPULATE_TRANSPORTS
    });
  },

  /**
   * @param  {string} type
   */
  handlePopulateSuccess: function(data) {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.POPULATION_SUCCESS,
      data: data
    })
  },

  /**
   * @param  {string} type
   */
  handlePopulateError: function(data) {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.POPULATION_ERROR,
      error: error
    })
  },
};

module.exports = AppActions;