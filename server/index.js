var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var request = require('request');
var uuid = require('node-uuid');

var NOAPP_MESSAGE_URL = 'http://6ee9257b.ngrok.io/chat/pullstring.message/';
var NOAPP_WELCOME_URL = 'http://6ee9257b.ngrok.io/chat/pullstring.welcome/';
var NOAPP_PORT = 13000;

if (process.argv.length > 2) {
    NOAPP_MESSAGE_URL = process.argv[2] + '/chat/pullstring.message/';
    NOAPP_WELCOME_URL = process.argv[2] + '/chat/pullstring.welcome/';
}

if (process.argv.length > 3) {
    NOAPP_PORT = parseInt(process.argv[3]);
}

app.get('/', function(req, res){
  console.log('welcome: ', NOAPP_WELCOME_URL);
  console.log('msg: ', NOAPP_MESSAGE_URL);

  res.send('<h1>Hello world</h1>');
});

app.get('/script.js', function(req, res){
    console.log('script.js requested');
    res.sendFile(__dirname + '/client/dist/script.js');
});

http.listen(NOAPP_PORT, function(){
  console.log('listening on *:%d', NOAPP_PORT);
});

function noapp_call(msg, the_url, cb) {
    request({
            url: the_url,
            qs: { from: 'some test' },
            method: 'POST',
            json: { user_msg: msg }
        }, function (error, response, body) {
            if (error) {
                console.log(error);
                cb([]);
            }

            if (response.statusCode != 200) {
                console.log('Invalid status code: ', response.statusCode);
                cb([]);
            }
            console.log('body=', body);
            cb(body.bot_response);
        }
    );
}

io.on('connection', function(socket){
      console.log('a user connected');
      var backup_cookie = 'default-' + uuid.v1(); // in case client doesn't send a cookie.

      socket.on('setup', function(msg){
        console.log('setup msg:', msg);
        if (!msg.clientcookie) {
          msg.clientcookie = backup_cookie;
        }
        noapp_call({cookie: msg.clientcookie, text: '', botid: msg.params.app_id }, NOAPP_WELCOME_URL, function(ret) {
          if (ret) {
            ret.forEach(function(value) {
              socket.emit('chat message', value);
            });
          }
        });
      });

      socket.on('disconnect', function(){
        console.log('user disconnected');
      });

      socket.on('chat message', function(msg){
        console.log('message msg:', msg);
        if (!msg.clientcookie) {
          msg.clientcookie = backup_cookie;
        }
        noapp_call({cookie: msg.clientcookie, text: msg.text, botid: msg.params.app_id }, NOAPP_MESSAGE_URL, function(ret) {
          if (ret) {
            ret.forEach(function(value) {
              socket.emit('chat message', value);
            });
          }
        });
      });
});
