var httpProxy = require('http-proxy');
var http = require('http');
var proxyAgent = new http.Agent({
	keepAlive: true,
	keepAliveMsecs: 7000
});

var proxy = httpProxy.createServer({
    target:'http://127.0.0.1:8080/loadavg',
    agent: proxyAgent
});

proxy.on('error', function(e, req, res) {
    //res.status( 500 ).end();
});

proxy.listen(9000);