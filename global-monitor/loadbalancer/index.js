var proxy = require('http-proxy');
var http = require('http');
var keepAliveAgent = new http.Agent({ keepAlive: true });

var proxies = {};

var loadBalancer = {
  start: function(servers) {
    console.log("Starting Load Balancer at localhost:4000");
    // Create a proxy object for each target.
    for (var i in servers) {
      this.addServer(servers[i]);
    }

    // Select the next server and send the http request.
    var nextServer = 0;
    var serverCallback = function(req, res) {
      var key = Object.keys(proxies)[nextServer++ % servers.length];
      var proxy = proxies[key];
      proxy.web(req, res);
      proxy.on('error', function(err) {
        console.log(err);
      });
    };

    var server = http.createServer(serverCallback);
    server.listen(4000);
  },
  addServer: function(server) {
    proxies[server] = new proxy.createServer({
        target: "http://"+server,
        agent: keepAliveAgent
    });
  },
  removeServer: function(server) {
    delete proxies[server];
  }
}

module.exports = loadBalancer;