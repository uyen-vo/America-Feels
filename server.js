//Setup web server and socket
var twitter = require('twitter'),
    express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io').listen(server);

//Setup twitter stream api
var twit = new twitter({
  consumer_key: 'iimPJJrdko91XqX7ti3NDnNfm',
  consumer_secret: 'RtU6DFsQfI1w4qczwarxzXHhBNBQtyxGt4LPuLtWL3Eof0V6Iv',
  access_token_key: '855837735877267457-HxHtvWdGbeKYovzG7sLLnEt35mEv0un',
  access_token_secret: 'iulYpXq8gzNRV0f2ysez5OjazIU1cSOd9S6sYTzOJM8rt'
}),
stream = null;

//Use the default port (for beanstalk) or default to 8081 locally
server.listen(process.env.PORT || 8081);

//Setup rotuing for app
app.use(express.static(__dirname + '/public'));

//Create web sockets connection.
io.sockets.on('connection', function (socket) {

  socket.on("start tweets", function() {
    if(stream === null) {
      //Connect to twitter stream passing in filter for entire united states.
      twit.stream('statuses/filter', {'locations':'-124.85, 24.39,-66.88,49.38'}, function(stream) {
          stream.on('data', function(data) {
              // Does the JSON result have coordinates
              if (data.coordinates){
                var outputPoint = {};
                if (data.coordinates !== null){
                  //Build json and send out to web sockets
                  outputPoint.lat = data.coordinates.coordinates[0];
                  outputPoint.lng = data.coordinates.coordinates[1];
                  var city = data.place.full_name;
                  outputPoint.city = city;
                  outputPoint.state = city.substring(city.lastIndexOf(',')+1).trim();

                  outputPoint.name = data.user.name;
                  outputPoint.screenname = data.user.screen_name;
                  outputPoint.avatar = data.user.profile_image_url;
                  outputPoint.tweet = data.text;
                  outputPoint.id_str = data.id_str;

                  var date = new Date(parseInt(data.timestamp_ms));
                  var d = date.toDateString().substr(4);
                  var t = (date.getHours() > 12) ? date.getHours()-12 + ':' + date.getMinutes() + ' PM' : date.getHours() + ':' + date.getMinutes() +' AM;';
                  outputPoint.timestamp = t + ' - ' + d;

                  socket.broadcast.emit("twitter-stream", outputPoint);

                  //Send out to web sockets channel.
                  socket.emit('twitter-stream', outputPoint);

                }
                else if(data.place){
                  if(data.place.bounding_box === 'Polygon'){
                    // Calculate the center of the bounding box for the tweet
                    var coord, _i, _len;
                    var centerLat = 0;
                    var centerLng = 0;

                    for (_i = 0, _len = coords.length; _i < _len; _i++) {
                      coord = coords[_i];
                      centerLat += coord[0];
                      centerLng += coord[1];
                    }
                    centerLat = centerLat / coords.length;
                    centerLng = centerLng / coords.length;

                    // Build json object and broadcast it
                    outputPoint.lat = centerLat;
                    outputPoint.lng = centerLng;
                    var city = data.place.full_name;
                    outputPoint.city = city;
                    outputPoint.state = city.substring(city.lastIndexOf(',')+1).trim();

                    outputPoint.name = data.user.name;
                    outputPoint.screenname = data.user.screen_name;
                    outputPoint.avatar = data.user.profile_image_url;
                    outputPoint.tweet = data.text;
                    outputPoint.id_str = data.id_str;

                    var date = new Date(parseInt(data.timestamp_ms));
                    var d = date.toDateString().substr(4);
                    var t = (date.getHours() > 12) ? date.getHours()-12 + ':' + date.getMinutes() + ' PM' : date.getHours() + ':' + date.getMinutes() +' AM;';
                    outputPoint.timestamp = t + ' - ' + d;

                    socket.broadcast.emit("twitter-stream", outputPoint);
                    
                    //Send out to web sockets channel.
                    socket.emit('twitter-stream', outputPoint);

                  }
                }
              }
              stream.on('limit', function(limitMessage) {
                return console.log(limitMessage);
              });

              stream.on('warning', function(warning) {
                return console.log(warning);
              });

              stream.on('disconnect', function(disconnectMessage) {
                return console.log(disconnectMessage);
              });
          });
      });
    }
  });

    // Emits signal to the client telling them that the
    // they are connected and can start receiving Tweets
    socket.emit("connected");
});

