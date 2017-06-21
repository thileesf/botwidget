# Botwidget
Power your website with this chat client.

BotWidget is an easy way to add an interactive chat experience to your browser to communicate with a Bot.

All you need to do is to include the javascript snippet to your web page and to modify the server component, and voilà!

How does it work?
===============

There are four actors here.
1. The client script. This script executes in the browser, shows the widget, accepts user input, and shows bot response.
2. The server that the client script talks to. This is your server.
3. A server that delivers the client script to the browser. 


Setup
====

You need `nodejs` and `npm` installed in your system.
See https://nodejs.org/en/download/package-manager/

Client Piece
-----------

# Adding the script to your HTML
You just need to add this to your html:
```
    <script type="text/javascript">
      var _noApp = {
        app_id: 'your-app-id'
      };
    </script>
    <script type="text/javascript">
      !function(){var a=document.createElement("script");a.async="true",a.src="//your.server.com/script.js";var b=document.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b)}();
    </script>
```

In the above, you can replace th `app_id` (eg: this can identify the client website) and the `your.server.com` (this is where your script would download the `script.js` from) to what you prefer.

# Building the client 

Do the following:
```
$ cd client
$ npm install
$ node_modules/.bin/webpack --progress --colors --display-modules -p
# this will create the file client/dist/script.js
```

# Delivering script.js

You can deliver your script.js using a simple endpoint on your webserver. Eg: if yours is a Node/Express webserver, you can do,
```
var app = require('express')();
var http = require('http').Server(app);

app.get('/script.js', function(req, res){
    console.log('script.js requested');
    res.sendFile(__dirname + '/client/dist/script.js');
});
```

The putting it together section below describes a complete example.



