## George the Dev Bot

George is a lightweight JavaScript-based chatbot designed for the Stack Exchange chat network. The goal is to eventually produce a bot that is capable of looking up nearly anything by being asked simple English questions.

### Usage Instructions

In order to use the bot, you will need an active account on the Stack Exchange network with enough reputation to use chat. You will also need [PhantomJS](http://phantomjs.org) installed. (PhantomJS 2.0+ is currently required.)

1. Copy the `config.js.default` to `config.js`

2. Open `config.js` and enter the authentication information

3. Run PhantomJS with the following command:

        phantomjs --ssl-protocol=any --load-images=false bot.js

### Contributions

We are happy to accept contributions of new code providing the following criteria are met:

1. the new code should be technically correct (no security issues, etc.)
2. the new code should provide a useful feature
3. the new code may not contain any profanity

Pull requests to fix bugs or tweak some of the regular expressions are welcome as well.
