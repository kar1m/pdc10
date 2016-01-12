var request = require('superagent'),
	express = require('express'),
	bodyParser = require('body-parser'),
	async = require('async');

// ----- Monitor -----

var servers = [
	"104.131.206.70"
];

var loadAvgSum = 0;

var functions = [];

function createfunc(i) {
    return function(callback) {
    	request
			.get('http://'+servers[i]+':8080/loadavg')
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

async.series(functions, function(err, res) {
	console.log(loadAvgSum/servers.length);
});

// ----- API -----

var app = express();
app.use(bodyParser.json());

app.get('/addserver', function (req, res) {
	var server = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	console.log('---');
	console.log(req.headers['x-forwarded-for']); 
    console.log(req.connection.remoteAddress); 
    console.log(req.socket.remoteAddress);
    console.log(req.connection.socket.remoteAddress);
    console.log('---');

	servers.push(server);
	console.log(servers);
	res.json(servers);
});

var server = app.listen(9000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('global-monitor app listening at http://%s:%s', host, port);
  console.log(servers);
});