var express = require('express'),
	monitor = require('monitor'),
	request = require('superagent');

// ------ Monitor ------

var processMonitor = new monitor({probeClass:'Process'});
processMonitor.connect();

var loadavg = [];

processMonitor.on('change', function() {
  loadavg = processMonitor.get('loadavg');
});


// ----- Subscribe server -----

var globalMonitor = "104.131.206.170";

request
	.get('http://'+globalMonitor+':9000/addserver')
	.end();

// ------ API ------

var app = express();

app.get('/loadavg', function (req, res) {
	res.json({
		"1": loadavg[0],
		"5": loadavg[1],
		"15": loadavg[2]
	});
});

var server = app.listen(8090, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('instance-monitor app listening at http://%s:%s', host, port);
});