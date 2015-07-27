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
