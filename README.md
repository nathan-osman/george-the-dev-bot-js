## George the Dev Bot

George is a lightweight JavaScript-based chatbot designed for the Stack Exchange chat network. The goal is to eventually produce a bot that is capable of looking up nearly anything by being asked simple English questions.

### Usage Instructions

In order to use the bot, you will need an active account on the Stack Exchange network with enough reputation to use chat. You will also need [PhantomJS](http://phantomjs.org) installed.

1. Copy the `config.js.default` to `config.js`

2. Open `config.js` and enter the authentication information

3. Run PhantomJS with the following command:

        phantomjs --ssl-protocol=any --load-images=false bot.js

### Contributions

[TODO]
