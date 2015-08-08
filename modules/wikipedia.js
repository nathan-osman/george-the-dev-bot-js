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

var webpage = require('webpage'),
    searchPage = webpage.create(),
    searchUrl = "https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&srsearch=",
    articleUrl = "https://en.wikipedia.org/wiki/";

exports.handlers = [
    {
        types: [8, 18],
        pattern: /^wh(?:at|o)\s+(?:was|is|were|are)\s+(.*[^?.])/i,
        process: function(data, match) {

            // Open the search page
            searchPage.open(searchUrl + encodeURIComponent(match[1]), function(status) {

                if(status != 'success') {
                    data.r("Sorry, but the search provider is currently down.");
                } else {

                    try {
                        // Parse the page data as JSON and read it
                        var json = JSON.parse(searchPage.plainText);
                        data.r(articleUrl + encodeURIComponent(json.query.search[0].title));
                    } catch(e) {
                        data.r("Sorry, but I wasn't able to find anything.");
                    }
                }

                return true;
            });
        }
    }
];
