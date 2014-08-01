var https = require("https");
var twitter = require('ntwitter');
//writing the OAUTH authentication for accessing Twitter API is not necessary and people usually use this library to make things a lot easier (ntwitter)
//Twitter Streaming API listens to all incoming tweets as they come in real-time

var twit = new twitter({
  consumer_key: 'BT8h5qcRYxa1opHZ4VX0DuW7h',
  consumer_secret: 'xZul4Vk00ajT3wtUQrc8w2iPhP2vLRrmETaRtuk1iVGPrUvkau',
  access_token_key: '161679280-PrYepOn61aW9udfHBampyQb5ZUzP9hKMSZAP6RI1',
  access_token_secret: 'pksRxeQO1hb8i8aB5zqBBfb7Qg8RL87U1RFCyH0B1fbJd'
});

var express = require("express");
var fs = require("fs");
var http = require("http");
var port = "1337";

var app = express();
//createServer was deprecated for express. Don't follow Tuts exactly 
app.use(express.static(__dirname + '/public'));

app.get("/", function(request, response) {
	var content = fs.readFileSync(__dirname + "/template.html");
	response.setHeader("Content-Type", "text/html");
	response.send(content);
});

var server = http.createServer(app);
var io = require('socket.io').listen(server);
server.listen(port);

twit.stream('statuses/filter', { track: ['naruto'] }, function(stream) {
  var body = '';
  stream.on('data', function (tweet) {
  	io.sockets.emit("tweet", tweet);
  });
  stream.on('end', function() {
  	console.log("Disconnected");
  });
});