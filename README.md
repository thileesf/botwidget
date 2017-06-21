# Botwidget

BotWidget is an easy way to power your website with an interactive chat that talks to a Bot.

<p align="center">
<img src="https://github.com/thileesf/botwidget/blob/master/eg.png" width="290">
</p>




## How Does It Work?

<p align="center">
<img src="https://github.com/thileesf/botwidget/blob/master/chatwidget.png">
</p>


There are four actors here.
1. The client script that executes in the browser, shows the widget, accepts user input, and shows bot response.
2. A server that delivers the client script bundle.
3. A server that the client script talks to.
4. A bot that carries out the conversation. 

Please refer to the [Wiki](https://github.com/thileesf/botwidget/wiki) for detailed instructions.

## Who Is This Useful To?
- If you already have a bot (created using any bot authoring tool), and you want to add a browser-based chat client to your bot.

For this, all you need to do is to include the javascript snippet with a custom `app_id` (see below) to your web page and modify the server component (to handle this custom id), and voilà!

- If you want to build a platform that brings together different bots for different websites. 

This is similar to above, but you need to maintain a handler for different `app_id`s in your server code.

## Quick Setup (localhost)

You need `nodejs` and `npm` installed in your system. See [install instructions](https://nodejs.org/en/download/package-manager)

```
$ cd client
$ npm install
$ ./pre_pack.sh "localhost:13000" 
$ node_modules/.bin/webpack --progress --colors --display-modules -p

# This will create the file `client/dist/script.js` which is actor 1 above.

$ cd ../server
$ npm install
$ cp -r ../client/dist .
$ node server.js 13000

# At this point your server is running, which is doing actor 2 & actor 3 above.
```

Open your broser and point it to `localhost:13000`.
Click the widget at the bottom right corner and play around.



