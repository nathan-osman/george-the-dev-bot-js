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
// the sandbox and making a websocket connection to receive messages.
var chatPage = webpage.create();

// Pass along anything printed to the console on the page
chatPage.onConsoleMessage = function(m) {
    console.log("[PAGE] " + m);
}

// Begin by listening for events in the sandbox. More rooms can be joined
// later using the joinRoom() method. Success is invoked once the page loads,
// error if something goes wrong, and callback when an event is received.
exports.initialize = function(success, error, callback) {

    // When a message is received from the WebSocket, it needs to be processed
    // to filter out messages that should not be processed (and avoid
    // duplication) - this must be done within the context of the page
    chatPage.onCallback = function(e) {
        data = chatPage.evaluate(function(e) {

            // Discard the event if it came from us
            if(e.user_id == CHAT.CURRENT_USER_ID) {
                return;
            }

            // Grab the event content if available
            var m = typeof e.content === 'undefined' ? '' : e.content;

            // Convert from HTML to text
            m = $('<div>').html(m).text();

            // Remove the '@xxx' from type 8 and 18
            if(e.event_type == 8 || e.event_type == 18) {
                m = m.replace(/^@\w+[:,]?/, '');
            }

            // Strip whitespace
            m = m.trim();

            return {
                e: e,
                m: m
            };
        }, e);

        // If data was returned, augment the data with methods for sending
        // replies and posting messages then invoke the callback
        if(data) {

            // Sends the specified reply either to the OP or to everyone
            data.r = function(m) {
                exports.sendMessage(data.e.room_id, ":" + data.e.message_id + " " + m);
            };
            data.s = function(m) {
                exports.sendMessage(data.e.room_id, m);
            }

            // Invoke the callback
            callback(data);
        }
    };

    // Open the sandbox
    chatPage.open('http://chat.stackexchange.com/rooms/1/sandbox', function(status) {

        if(status != 'success') {
            error('unable to load chat homepage');
            return;
        } else {
            success();
        }

        // Create the WebSocket connection
        chatPage.evaluate(function() {

            // Process a message received from the socket
            function processMessage(e) {
                $.each(JSON.parse(e.data), function(key, value) {

                    // Each response includes events for all of the
                    // rooms that we're in, leading to duplication - so
                    // make sure that events are only processed for the
                    // room that they were posted to
                    var match = key.match(/r(\d+)/);
                    if(match && 'e' in value) {

                        // Problem number two - direct messages (type 8
                        // and 18) are also sent as type 1 - so make
                        // sure only the type 8/18 events propagate
                        var seen = {};

                        // Build a set of all non-1 events
                        $.each(value.e, function(i, e) {
                            if(e.event_type != 1) {
                                seen[e.message_id] = null;
                            }
                        });

                        // Send all events *except* type 1 *if* the
                        // message ID was seen with another type
                        $.each(value.e, function(i, e) {
                            if(e.room_id == match[1] &&
                                    (e.event_type != 1 ||
                                    !(e.message_id in seen))) {
                                window.callPhantom(e);
                            }
                        });
                    }
                });
            }

            // Create the websocket connection
            function connectToSocket(data) {
                // Create the WebSocket connection, ensuring no old
                // messages are received by passing a large value
                var socket = new WebSocket(data.url + '?l=999999999999');

                // Invoke the callback whenever a new event arrives
                socket.onmessage = processMessage;

                // Reconnect when the socket is closed
                socket.onclose = function(e) {
                    console.log("WebSocket closed by server");
                    setTimeout(connectToSocket, 60000, data);
                };

                // Indicate an error when the socket is interrupted
                socket.onerror = function(e) {
                    console.log(e.message);
                    setTimeout(connectToSocket, 60000, data);
                };
            }

            $.ajax({
                data: {
                    fkey: fkey().fkey,
                    roomid: 1
                },
                success: connectToSocket,
                type: 'POST',
                url: '/ws-auth'
            });
        });
    });
};

// Join the specified room
exports.joinRoom = function(room) {
    chatPage.evaluate(function(room) {
        var data = {
            fkey: fkey().fkey
        };
        data['r' + room] = 999999999999;
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

// Star a message
exports.starMessage = function(id) {
    chatPage.evaluate(function(id) {
        $.ajax({
            data: {
                fkey: fkey().fkey
            },
            type: 'POST',
            url: '/messages/' + id + '/star'
        });
    }, id);
};
