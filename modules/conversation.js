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
        types: [1, 8, 18],
        pattern: /^(?:(?:hi|hello|hey|(?:good\s+)?(?:morning|afternoon|evening))(?:,?\s*(?:all|everyone))?[!.]?)/i,
        process: function(data) {
            data.r(util.oneOf(
                "Hi!",
                "Hello.",
                "Howdy!",
                "Greetings."
            ));
            return true;
        }
    },
    {
        types: [1, 8, 18],
        pattern: /^(\\o|o\/)$/i,
        process: function(data, match) {
            data.r(match[1] == "\\o" ? "o/" : "\\o");
            return true;
        }
    },
    {
        types: [1, 8, 18],
        pattern: /^(?:good)?(?:bye|night)(?:,?\s*(?:all|everyone))?[!.]?/i,
        process: function(data) {
            data.r("See you later.");
            return true;
        }
    },
    {
        types: [8, 18],
        pattern: /\bthank(?:s|(?:-|\s+)you)\b/i,
        process: function(data) {
            data.r("You're welcome!");
            return true;
        }
    }
];
