/**
 * George the Dev - Stack Exchange Chatbot
 * Copyright 2015 - Nathan Osman
 */

exports.process = function(e) {

    // Check for the occurrence of "time"
    if(e.content.match(/\btime\b/)) {
        return "It is currently " + (new Date()).toGMTString() + ".";
    }
};
