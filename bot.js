/**
 * George the Dev - Stack Exchange Chatbot
 * Copyright 2015 - Nathan Osman
 */

// Import the various modules
var api     = require('./api'),
    config  = require('./config'),
    login   = require('./login'),
    process = require('./process');

// Print the program header
console.log("=======================================");
console.log("George the Dev - Stack Exchange Chatbot");
console.log("Copyright 2015 - Nathan Osman");
console.log("=======================================");

// Upon error, write to STDOUT and exit
function error(message) {
    console.log("[ERROR] " + message);
    phantom.exit();
}

// Perform login
login.login(config.email, config.password, function() {

    console.log("[INFO] authorization complete");

    api.initialize(function(event) {

        // Only respond to direct pings ATM
        if(event.event_type == 8 || event.event_type == 18) {
            api.acknowledgeMessage(event.message_id);

            reply = process.process(event);
            if(typeof reply !== 'undefined') {
                api.sendMessage(event.room_id, ":" + event.message_id + " " + reply);
            }
        }

    }, error);
}, error);
