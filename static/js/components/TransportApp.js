var Map = require('./Map');
var TransportTable = require('./TransportTable');
var AppActions = require('../actions/AppActions');
var AppStore = require('../stores/AppStore');

function allTransports() {
  return AppStore.getAllTransports();
}

function activeTransports() {
 return AppStore.getAllActive();
}

var TransportApp = React.createClass({
  getInitialState: function() {
    return {
      transports: [],
      activeTransports: []
    };
  },

  componentWillMount: function() {
    AppActions.populateTransports();
  },

  componentDidMount: function() {
    AppStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    AppStore.removeChangeListener(this._onChange);
  },

  render: function() {
    return(
      <div id="container">
        <div id="map" className="item">
          <Map activeTransports={this.state.activeTransports}/>
        </div>
        <TransportTable
          transports={this.state.transports}/>
      </div>
    );
  },

  _onChange: function(){
    this.setState({
      activeTransports: activeTransports(),
      transports: allTransports()
    });
  }
});

module.exports = TransportApp;
