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

var util = require('./util');

exports.handlers = [
    {
        types: [3],
        pattern: /^$/,
        process: function(data) {

            // Check to see if this user has already been greeted
            var userList = util.dataRead('greetings-' + data.e.room_id) || [];

            // If not, then greet them
            if(userList.indexOf(data.e.user_id) == -1) {

                var roomName = data.e.room_name.replace(/^the/i, '').replace(/room$/i, '');
                data.s("Welcome to the " + roomName + " room, @" +
                        data.e.user_name.replace(/\s/g, '') + "!");

                // Remember not to greet them again
                userList.push(data.e.user_id);
                util.dataWrite('greetings-' + data.e.room_id, userList);
            }

            return true;
        }
    }
];
