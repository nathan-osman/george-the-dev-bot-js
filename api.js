/**
 * George the Dev - Stack Exchange Chatbot
 * Copyright 2015 - Nathan Osman
 */

var webpage = require('webpage');

// This file contains the code that actually interacts with the chat API,
// facilitating the sending and receiving of messages. This is done by opening
// a page on the sandbox (George is always there) and then joining other rooms
// as necessary.
var chatPage = webpage.create();

// This little hack prevents the page from using WebSockets by completely
// disabling the WebSocket constructor
chatPage.onInitialized = function() {
    chatPage.evaluate(function() {
        window.WebSocket = null;
    });
};

// Create chat page and register callbacks to receive events and errors
exports.initialize = function(callback, error) {

    chatPage.onCallback = callback;
    chatPage.open('http://chat.stackexchange.com/rooms/1/sandbox', function(status) {

        if(status != 'success') {
            error('unable to load chat homepage');
            return;
        }

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
