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

var api = require('./api');

// Each of the modules for George to load must be listed here
var modules = [
    'conversation',
    'favorites',
    'fun',
    'manpage',
    'math',
    'time',
    'unix'  // TODO: disable this on other platforms
];

// Build a list of handlers from each of the modules
var handlers = [];
for(var i = 0; i < modules.length; ++i) {
    handlers.push.apply(handlers, require('./modules/' + modules[i]).handlers);
}

console.log("[INFO] loaded " + handlers.length +
    " handler(s) from " + modules.length + " module(s).");

// Process the provided event by running it through the list of handlers. The
// first handler that matches will be used to process the event.
exports.process = function(data) {

    // Currently known event types:
    //  1 - a message was posted
    //  2 - a message was edited
    //  3 - a user has joined
    //  4 - a user has left
    //  8 - @user message
    // 18 - direct reply to user

    for(var i = 0; i < handlers.length; ++i) {
        if(handlers[i].types.indexOf(data.e.event_type) != -1) {

            // Check for a match and if so, send it off for processing
            var match = data.m.match(handlers[i].pattern);
            if(match && handlers[i].process(data, match)) {
                return;
            }
        }
    }
};
