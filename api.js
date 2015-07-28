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

var webpage = require('webpage');

// This file contains the code that actually interacts with the chat API,
// facilitating the sending and receiving of messages. This is done by opening
// a page on the sandbox (George is always there) and then joining other rooms
// as necessary.
var chatPage = webpage.create(),
    currentUser = 0;

// This little hack prevents the page from using WebSockets by completely
// disabling the WebSocket constructor
chatPage.onInitialized = function() {
    chatPage.evaluate(function() {
        window.WebSocket = null;
    });
};

// Retrieve the current user.
exports.currentUser = function() {
    return currentUser;
};

// Load a single chat page (the sandbox) which will be used to receive all
// events as they are received. More rooms can be joined later. Success is
// invoked once the page loads, error if something goes wrong, and callback
// when an event is received.
exports.initialize = function(success, error, callback) {

    chatPage.onCallback = callback;
    chatPage.open('http://chat.stackexchange.com/rooms/1/sandbox', function(status) {

        if(status != 'success') {
            error('unable to load chat homepage');
            return;
        }

        // Indicate success
        success();

        // Grab the current user
        currentUser = chatPage.evaluate(function() {
            return CHAT.CURRENT_USER_ID;
        });

        // This really twisted piece of code intercepts all AJAX responses
        // made by the page and extracts any events and invokes the callback
        chatPage.evaluate(function() {
            $(document).ajaxSuccess(function(e, jqXHR, ajaxOptions, data) {
                if(ajaxOptions.url == '/events') {
                    $.each(data, function(key, value) {
                        if(key.match(/r(\d+)/)) {
                            if('e' in value) {
                                $.each(value.e, function(index, event) {
                                    window.callPhantom(event);
                                });
                            }
                        }
                    });
                }
            });
        });
    });
};

// Join the specified room
exports.join = function(room) {
    chatPage.evaluate(function(room) {
        var data = {
            fkey: fkey().fkey
        };
        data['r' + room] = 0;
        $.ajax({
            data: data,
            type: 'POST',
            url: '/events'
        });
    }, room);
};

// Post the specified message to the specified room
exports.sendMessage = function(room, message) {
    chatPage.evaluate(function(room, message) {
        $.ajax({
            data: {
                fkey: fkey().fkey,
                text: message
            },
            type: 'POST',
            url: '/chats/' + room + '/messages/new'
        });
    }, room, message);
};

// Acknowledge receipt of the specified message
exports.acknowledgeMessage = function(id) {
    chatPage.evaluate(function(id) {
        $.ajax({
            data: {
                fkey: fkey().fkey,
                id: id
            },
            type: 'POST',
            url: '/messages/ack'
        });
    }, id);
};
