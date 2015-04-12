var Map = require('./Map');
var TransportTable = require('./TransportTable');

var TransportApp = React.createClass({
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

module.exports = TransportApp;
