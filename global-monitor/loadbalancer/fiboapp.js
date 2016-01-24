var http = require('http');

function fibo(n) {
  if (n == 0 || n == 1) {
    return n;
  }
  return fibo(n-1) + fibo(n-2);
}

var port = process.argv[2];

var serverCallback = function(req, res) {
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.end(""+port+" "+fibo(25));
};

var server = http.createServer(serverCallback);
server.listen(process.argv[2]);