require('dotenv').config();

let util = require('util');
let http = require('http');
let Bot  = require('@kikinteractive/kik');

// Example interface to facilitate sending messages to the Dialog API.
let Dialog = require('./dialog');

// Configure the bot API endpoint, details for your bot
let bot = new Bot({
    username: 'frankiemusicbot',
    apiKey: process.env.KIK_API_TOKEN,
    baseUrl: process.env.BOT_HOST
});

bot.updateBotConfiguration();

bot.onTextMessage((message) => {
  Dialog.incoming(message);

  var response = message.reply(message.body);

  response.then(function(requests) {
    requests.forEach((request) => {
      body = JSON.parse(request.body);
      body.messages.forEach((message) => {
        Dialog.outgoing(message);
      });
    });
  });
});

// Set up your server and start listening
let server = http
  .createServer(bot.incoming())
  .listen(process.env.PORT || 8080);
