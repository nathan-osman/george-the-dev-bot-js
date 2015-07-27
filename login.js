/**
 * George the Dev - Stack Exchange Chatbot
 * Copyright 2015 - Nathan Osman
 */

var webpage = require('webpage');

// When provided with an email address and password, this function will attempt
// to log the user in. The auth cookies that are set should persist for the
// current PhantomJS session.
exports.login = function(email, password, success, error) {

    var loginPage = webpage.create();

    loginPage.onLoadFinished = function(status) {

        if(status != 'success') {
            error("unable to display login page.");
            return;
        }

        // TODO: this technique is fragile but it works for now - just keep
        // feeding in the login credentials and mashing the submit button
        // until the Stack Exchange homepage is loaded
        if(loginPage.url == 'http://stackexchange.com/') {
            loginPage.close();
            success();
        } else {
            loginPage.switchToFrame('affiliate-signin-iframe');
            loginPage.evaluate(function(email, password) {
                $('#email').val(email);
                $('#password').val(password);
                $('input[type=submit]').click();
            }, email, password);
        }
    };

    loginPage.open('https://stackexchange.com/users/login#log-in');
};
