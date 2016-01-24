var sys = require('sys'),
	exec = require('child_process').exec,
	request = require('superagent'),
	express = require('express'),
	bodyParser = require('body-parser'),
	async = require('async'),
	ipaddr = require('ipaddr.js'),
	loadbalancer = require(__dirname + '/loadbalancer/index.js');

var servers = [
	"104.131.206.70"
];

// ----- Load balancer -----

loadbalancer.start(servers);

// ----- Monitor -----

var loadAvgSum = 0;

var functions = [];

function createfunc(i) {
    return function(callback) {
    	request
			.get('http://'+servers[i]+':8090/loadavg')
			.set('Accept', 'application/json')
			.end(function(err, res){
				if(err) {
					callback(1, null);
					return;
				}
				loadAvgSum += parseFloat(res.body["1"]);
				callback(null, 0);
		});
	};
}
for (server in servers) {
	functions.push(createfunc(server));
}

// Check load averages of all workers every 5 seconds
setInterval(function(){
	loadAvgSum = 0;
	console.log("Checking load averages for "+servers.length+" workers");
	async.series(functions, function(err, res) {
		monitorAction(loadAvgSum/servers.length);
		console.log(loadAvgSum/servers.length);
	});
}, 5000);

var waitingForInstanceProvisioning = false;
function monitorAction(loadAvg) {
	if (waitingForInstanceProvisioning) {
		return;
	}

	// Scale UP
	if (loadAvg > 0.7) {
		console.log("Load avg is higher than 0.7, provisioning new worker ...");
		waitingForInstanceProvisioning = true;
		// Trigger new worker deploy script
		function callback(error, stdout, stderr) { console.log(stdout); }
		exec("ls", callback);
	}
	// Scale Down
	else if (loadAvg < 0.5 && servers.length > 1) {
		console.log("Load avg is lower than 0.5, removing 1 worker ...");
		waitingForInstanceProvisioning = true;
		var lastServer = servers[servers.length-1];
		loadbalancer.removeServer(lastServer);
    	array.splice(servers.length-1, 1);
	}
}

// ----- API -----

var app = express();
app.use(bodyParser.json());

app.get('/addserver', function (req, res) {
	var server = requestIp(req);
	servers.push(server);
	loadbalancer.addServer(server);
	functions.push(createfunc(servers.length-1));
	waitingForInstanceProvisioning = false;
	console.log(servers);
	res.json(servers);
});

var server = app.listen(9000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('global-monitor app listening at http://%s:%s', host, port);
  console.log(servers);
});


// ----- Utils -----

function requestIp(req) {
    var ipString = (req.headers["X-Forwarded-For"] ||
        req.headers["x-forwarded-for"] ||
        '').split(',')[0] ||
        req.connection.remoteAddress;

    if (ipaddr.isValid(ipString)) {
        try {
            var addr = ipaddr.parse(ipString);
            if (ipaddr.IPv6.isValid(ipString) && addr.isIPv4MappedAddress()) {
                return addr.toIPv4Address().toString();
            }
            return addr.toNormalizedString();
        } catch (e) {
            return ipString;
        }
    }
    return 'unknown';
}