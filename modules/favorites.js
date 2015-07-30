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

// George's favorite things
var FAVORITES = {
    "city":             "Georgetown",
    "color":            "blue",
    "colour":           "blue (and it's spelled 'color' FYI)",
    "company":          "Canonical",
    "food":             "fish (surprise)",
    "os":               "Linux",
    "operating system": "Linux",
    "thing":            "doing nothing or almost nothing",
    "user":             "me (yeah, I'm a bit of a narcissist)",
    "website":          "[Ask Ubuntu](http://askubuntu.com)"
};

// Retrieve a user's current list of favorites
function getFavorites(id) {
    return JSON.parse(localStorage.getItem('favorites-' + id) || "{}");
}

// Store a user's list of favorites
function setFavorites(id, favorites) {
    localStorage.setItem('favorites-' + id, JSON.stringify(favorites));
}

exports.handlers = [
    {
        types: [8, 18],
        pattern: /^my\s+favou?rite\s+(.*?)\s+(?:is|are)\s+(.*[^.])/i,
        process: function(data, match) {

            var thing = match[1].toLowerCase(),
                value = match[2].toLowerCase().trim();

            // Store the new value
            var favorites = getFavorites(data.e.user_id);
            favorites[thing] = value;
            setFavorites(data.e.user_id, favorites);

            return true;
        }
    },
    {
        types: [8, 18],
        pattern: /^wh(?:at|o|ich)('s|\s+(?:is|are))\s+(your|my)\s+favou?rite\s+(.*[^?.])/i,
        process: function(data, match) {

            // Fill in the patterns from the expression
            var verb  = match[1].toLowerCase(),
                who   = match[2].toLowerCase(),
                thing = match[3].toLowerCase().trim();

            // Change "'s" to is
            if(verb == "'s") {
                verb = "is";
            }

            // Where we look for favorites depends on who the user is asking
            // about - use the predefined list for George and localStorage
            // for retrieving user favorites
            if(who == "your") {
                if(thing in FAVORITES) {
                    data.r("My favorite " + thing + " " + verb +
                            " " + FAVORITES[thing] + ".");
                } else {
                    data.r("I don't have a favorite " + thing + ".");
                }
            } else {

                // Load the current list of user favorites
                var favorites = getFavorites(data.e.user_id);

                // Check to see if the thing exists
                if(thing in favorites) {
                    data.r("Your favorite " + thing + " " + verb +
                            " " + favorites[thing] + ".");
                } else {
                    data.r(util.oneOf(
                        "How should I know?",
                        "I don't know.",
                        "Beats me."
                    ));
                }
            }

            return true;
        }
    }
];
