var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var request = require('request');
var uuid = require('node-uuid');
var PS = require('pullstring');

var SERVER_PORT = 80;

if (process.argv.length > 2) {
    SERVER_PORT = parseInt(process.argv[2]);
}

http.listen(SERVER_PORT, function() {
    console.log('listening on *:%d', SERVER_PORT);
});



// Endpoint that returns the client script.
// This is actor 2 in README
app.get('/script.js', function(req, res) {
    console.log('script.js requested');
    res.sendFile(__dirname + '/dist/script.js');
});



// keep the app_id (in client html script) to bot project/key mapping here.
var id_mapping = {
    roshambo : { project: 'e50b56df-95b7-4fa1-9061-83a7a9bea372', key:  '9fd2a189-3d57-4c02-8a55-5f0159bff2cf' },
};



// each entry is 'cookie': {obj: pullstringConvObj, conv_id: id }
// a bit hacky. need to re-visit
var conversations = {}; 



function handle_setup(msg, cb) {
    console.log('Handling setup. msg = ' + JSON.stringify(msg));

    var prj_key = id_mapping[msg.params.app_id];
    if (prj_key === undefined) {
        console.log('ERROR: Unsupported app_id: ' + msg.params.app_id); 
        cb([]);
        return;
    }
    
    var ps_req = new PS.Request({ apiKey: prj_key.key }); 
    var entry = conversations[msg.clientcookie];

    var conversation;
    if (entry) {
        conversation = entry.obj;
        ps_req.conversation_id = entry.conv_id;
    } else {
        conversation = new PS.Conversation();
        conversation.onResponse = function(response) {
            //console.log('response: ' + JSON.stringify(response));
            var bot_response = [];
            for (var output of response.outputs) {
                bot_response.push(output.text);
            }
            //console.log('Setup bot_response is: ' + JSON.stringify(bot_response));
            conversations[msg.clientcookie].conv_id = response.conversationId;
            cb(bot_response);
        }
        conversations[msg.clientcookie] = { obj: conversation, conv_id: null};
    }

    console.log('Starting conversation');
    conversation.start(prj_key.project, ps_req);
}



function handle_message(msg, cb) {
    //console.log('Handling message, msg = ' + JSON.stringify(msg));
    //console.log('Conversations: ' + JSON.stringify(conversations));

    var entry = conversations[msg.clientcookie];

    if (entry === undefined) {
        console.log('ERROR: Could not find the conversation entry!');
        cb([]);
        return;
    }

    var conversation = entry.obj;
    console.log('Sending text');
    conversation.sendText(msg.text);
}


// Websocket handler
io.on('connection', function(socket) {
    console.log('a user connected');
    var backup_cookie = 'makeshift-' + uuid.v1(); // in case client doesn't send a cookie.

    socket.on('setup', function(msg) {
        //console.log('setup msg:', JSON.stringify(msg));
        msg.clientcookie = msg.clientcookie? msg.clientcookie : backup_cookie;
        handle_setup(msg, function(ret) {
            if (ret) {
                ret.forEach(function(value) {
                    socket.emit('chat message', value);
                });
            }
        });
    });

    socket.on('disconnect', function() {
        console.log('user disconnected');
    });

    socket.on('chat message', function(msg) {
        //console.log('message msg:', JSON.stringify(msg));
        msg.clientcookie = msg.clientcookie? msg.clientcookie : backup_cookie;
        handle_message(msg, function(ret) {
            if (ret) {
                ret.forEach(function(value) {
                    socket.emit('chat message', value);
                });
            }
        });
    });
});


// A sample html page that includes the script
app.get('/', function(req, res){
    var html_data = '<html>' +
    '<body>' +
        '<h1>A simple test to show the bot widget</h1>' +
        '<h2>Cat Ipsum</h2>' +
        "<p>Pelt around the house and up and down stairs chasing phantoms roll over and sun my belly attack feet, and have secret plans purr for no reason, or sit and stare. Shove bum in owner's face like camera lens intently stare at the same spot i just saw other cats inside the house and nobody ask me before using my litter box friends are not food always hungry so climb a tree, wait for a fireman jump to fireman then scratch his face swat turds around the house. Chew foot sniff other cat's butt and hang jaw half open thereafter and leave dead animals as gifts, so lick the other cats love to play with owner's hair tie. Pet right here, no not there, here, no fool, right here that other cat smells funny you should really give me all the treats because i smell the best and omg you finally got the right spot and i love you right now meowzer, but attack the dog then pretend like nothing happened eat grass, throw it back up make muffins, and hunt by meowing loudly at 5am next to human slave food dispenser, my left donut is missing, as is my right. Intently sniff hand i cry and cry and cry unless you pet me, and then maybe i cry just for fun damn that dog so stare at ceiling light. Paw at beetle and eat it before it gets away cats go for world domination for lie in the sink all day. Lounge in doorway. Meowing chowing and wowing favor packaging over toy but rub whiskers on bare skin act innocent for kitty scratches couch bad kitty stretch, so destroy couch as revenge, and meow all night having their mate disturbing sleeping humans. Poop in the plant pot wake up human for food at 4am. Spread kitty litter all over house. Eat half my food and ask for more lay on arms while you're using the keyboard leave dead animals as gifts, or sleep on keyboard, for spot something, big eyes, big eyes, crouch, shake butt, prepare to pounce stare at wall turn and meow stare at wall some more meow again continue staring . Eat grass, throw it back up find empty spot in cupboard and sleep all day lie in the sink all day scream for no reason at 4 am but bleghbleghvomit my furball really tie the room together, mew or kitty scratches couch bad kitty. Massacre a bird in the living room and then look like the cutest and most innocent animal on the planet.</p>" +
        '<script type="text/javascript">' +
        '    var _noApp = {' +
        "      app_id: 'roshambo'" +
        '    };' +
        '</script>' +
        '<script type="text/javascript">' +
        '    !function(){var a=document.createElement("script");a.async="true",a.src="http://localhost:' + SERVER_PORT + '/script.js";var b=document.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b)}();' +
        '</script>' +
    '</body>' +
'</html>';
    res.send(html_data);
});
