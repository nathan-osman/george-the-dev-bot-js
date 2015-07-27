/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Nathan Osman
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
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
