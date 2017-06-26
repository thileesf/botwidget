import $ from 'jquery';
import socket from 'socket.io-client';

// Stylesheets
require('./app.scss');

let $noAppContainer;
let $noAppMessageInput;
let $body;
let noAppSocket;
let $noAppMessages;
let $messagesContainer;
let $chatHandlerButton;
let $chatHeaderClose;
let $head;
let $responsiveHead;

$(document).ready(() => {
  $body = $('body');
  $head = $('head');

  $chatHandlerButton = $('<div id="openChat" style="position: fixed; margin: 10px; bottom: 0; right: 0; display: flex"><div id="instantMessageWrapper"><div class="closeInstantMessage" id="closeNotification">X</div><div class="instantMessage" id="instantMessage"><div></div></div></div><div id="openChatBig"><div id="notificationNumber">1</div><img style="width: 80px;" src="http://i.imgur.com/KgK49MU.png"></div></div>');

  $chatHandlerButton.find('#openChatBig').click(() => {
    $noAppContainer.show();
    hideChatHandlerButton();
    addReponsiveHeader();
  });

  $chatHandlerButton.find('#closeNotification').click(() => {
    $chatHandlerButton.find('#instantMessageWrapper').hide();
    hideNotificationNumber();
  });

  connectToNoAppSocket();
  initMessageReceiver();
  showChat();

  $body.append($chatHandlerButton);

  $('#noAppMessageForm').on('submit', (event) => {
    event.preventDefault();
    emitMessageToNoApp($noAppMessageInput.val());
    return false;
  });

  $noAppContainer = $('#noAppContainer');
  $messagesContainer = $('#messagesContainer');

  $responsiveHead = $('<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>');
});

function connectToNoAppSocket() {
  var proto = 'wss';
  if (location.protocol != 'https:') {
    proto = 'ws';
  }
  var websock_uri = proto + '://localhost:13000';
  noAppSocket = socket(websock_uri);
  console.log('Connected to', websock_uri);
  noAppSocket.emit('setup', {text: '', params: _noApp, clientcookie: getOrCreateCookie() });
}

function emitMessageToNoApp(message) {
  noAppSocket.emit('chat message', {text: message, params: _noApp, clientcookie: getOrCreateCookie()});
  displayMessageSent(message);
}

function initMessageReceiver() {
    noAppSocket.on('chat message', message => {
    displayMessageReceived(message);
    updateInstanceMessage(message);
  });
}

function updateInstanceMessage(message) {
  $chatHandlerButton.find('#instantMessage').text(message);
  showInstanceMessage();
  showNotificationNumber();
}

function showInstanceMessage() {
  $chatHandlerButton.find('#instantMessageWrapper').show();
}

function showNotificationNumber() {
  $chatHandlerButton.find('#notificationNumber').show();
}

function hideNotificationNumber() {
  $chatHandlerButton.find('#notificationNumber').hide();
}

function getOrCreateCookie() {
  function generateUUID(){
      var d = new Date().getTime();
      if(window.performance && typeof window.performance.now === "function"){
          d += performance.now(); //use high-precision timer if available
      }
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = (d + Math.random()*16)%16 | 0;
          d = Math.floor(d/16);
          return (c=='x' ? r : (r&0x3|0x8)).toString(16);
      });
      return uuid;
  }

  var noapp_cookie = undefined;
  if (document.cookie) {
    $.each(document.cookie.split(/; */), function() {
      var splitCookie = this.split('=');
      if (splitCookie[0] === 'noapp.io.cookie') {
        noapp_cookie = splitCookie[1];
      }
    });
  }
  if (!noapp_cookie) {
    var exp_ms = new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toUTCString(); // 1 month
    noapp_cookie = generateUUID();
    document.cookie = "noapp.io.cookie=" + noapp_cookie + "; expires=" + exp_ms + "; path=/;";
  }
  return noapp_cookie;
}

function displayMessageReceived(message) {
  const receivedMessageRow = `<li>
<div class="messageReceivedContainer">
  <div class="messageReceivedDetail">
    <div class="bubble bubrecv">
      <div class="para">${message}</div>
    </div>
  </div>
</div>
</li>`;

  $noAppMessages.append(receivedMessageRow);
  $noAppMessages.scrollTop($noAppMessages[0].scrollHeight);
  scrollTopBottom();
}


function displayMessageSent(message) {
  const receivedMessageRow = `<li>
  <div class="messageSentContainer">
    <div class="messageSentDetail">
      <div class="bubble bubsent">
        <div class="para">${message}</div>
      </div>
    </div>
  </div>
</li>`;

  $noAppMessages.append(receivedMessageRow);
  $noAppMessages.scrollTop($noAppMessages[0].scrollHeight);
  $noAppMessageInput.val('');
  scrollTopBottom();
}


function showChat() {
  const chatHtml = `<form id="noAppMessageForm"><div class="noAppContainer" id="noAppContainer">
    <div class="chatContainer">
        <div class="chatHeader">
          <div class="chatHeaderTitle">Chat</div>
          <div class="chatHeaderClose" id="chatHeaderClose">X</div>
        </div>
        <div class="messagesContainer" id="messagesContainer">
          <ul id="noAppMessages" >
          </ul>
        </div>
        <div class="inputFieldsContainer">
          <input type="text" id="noAppMessageInput" name="noAppMessage" placeholder="Type your message here..." class="noAppMessageInput" required>
          <button type="submit" class="noAppSubmitMessageButton">Send</button>
        </div>
    </div>
  </div></form>`;

  $body.append(chatHtml);
  $noAppMessageInput = $body.find('#noAppMessageInput');
  $noAppMessages = $body.find('#noAppMessages');
  $chatHeaderClose = $body.find('#chatHeaderClose');
  closeChat($chatHeaderClose);
}

function scrollTopBottom() {
  $messagesContainer.scrollTop($messagesContainer[0].scrollHeight);
}

function showChatHandlerButton() {
  $chatHandlerButton.show();
}

function hideChatHandlerButton() {
  $chatHandlerButton.hide();
}

function addReponsiveHeader() {
  $head.append($responsiveHead);
}

function removeReponsiveHeader() {
  $responsiveHead.remove();
}

function closeChat($closeElement) {
  $closeElement.click((event) => {
    event.preventDefault();
    $noAppContainer.hide();
    showChatHandlerButton();
    removeReponsiveHeader();
  });
}
