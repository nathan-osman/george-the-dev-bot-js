/**
 * George the Dev - Stack Exchange Chatbot
 * Copyright 2015 - Nathan Osman
 */

var config  = require('./config'),
    webpage = require('webpage');

// In order to access the chat pages, the user must first log into their
// Stack Exchange account. This consists of entering email/password and
// proceeding through the confirmation steps. The callback will be invoked
// when the login succeeds.
exports.login = function(callback) {

    // Load the initial login page
    var loginPage = webpage.create();

    // Process each step of the login process
    loginPage.onLoadFinished = function(status) {

        // Check for an error
        if(status != 'success') {
            console.log("Unable to display login page.");
            phantom.exit();
        }

        // This technique is fragile but it works for now - just keep
        // feeding in the login credentials and mashing the submit button
        // until the Stack Exchange homepage is loaded
        if(loginPage.url == 'http://stackexchange.com/') {
            loginPage.close();
            callback();
        } else {
            loginPage.switchToFrame('affiliate-signin-iframe');
            loginPage.evaluate(function(email, password) {
                $('#email').val(email);
                $('#password').val(password);
                $('input[type=submit]').click();
            }, config.email, config.password);
        }
    };

    // Load the page
    loginPage.open('https://stackexchange.com/users/login#log-in');
};
