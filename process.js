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

// Each of the modules for George to load must be listed here
var modules = [
    'greetings',
    'time'
];

// Import the modules from the list by generating the import path and replacing
// the entry in the list with the module's process() function
for(var i = 0; i < modules.length; ++i) {
    modules[i] = require('./modules/' + modules[i]).process;
}

// Given an event, determine the response (if any) to the event.
exports.process = function(e) {

    // Remove the '@xxx:' from the beginning
    m = e.content.trim().replace(/^@\w+:?/, '').trim();

    // If any of the modules is able to process the event, immediately return
    for(var i = 0; i < modules.length; ++i) {
        var reply = modules[i](e, m);
        if(typeof reply !== 'undefined') {
            return reply;
        }
    }
};
