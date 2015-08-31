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

var process = require('child_process'),
    util    = require('./util');

exports.handlers = [
    {
        types: [8, 18],
        pattern: /^(ping6?)\s+([\w.-]+)$/i,
        process: function(data, match) {

            // Spawn a process to perform the ping
            var child = process.spawn(match[1].toLowerCase(), ['-c', '4', match[2]]);

            // Collect all of the output
            var stdout = '',
                stderr = '';
            child.stdout.on('data', function(data) {
                stdout += data;
            });
            child.stderr.on('data', function(data) {
                stderr += data;
            });

            // When it completes, display the result
            child.on('exit', function(code) {
                data.s(util.pre((code ? stderr : stdout).trim()));
            });

            return true;
        }
    },
    {
        types: [8, 18],
        pattern: /^dig\s+(?:(a|a{4}|mx)\s+)?([\w.-]+)$/i,
        process: function(data, match) {

            // Spawn a child process to perform the dig
            var type = match[1].toLowerCase() || 'a',
                domain = match[2].toLowerCase();

            // Collect all of the output
            var child = process.spawn('dig', [type, domain]);

            // Collect all of the output
            var stdout = '',
                stderr = '';
            child.stdout.on('data', function(data) {
                stdout += data;
            });
            child.stderr.on('data', function(data) {
                stderr += data;
            });

            // When it completes, display the result
            child.on('exit', function(code) {
                data.s(util.pre((code ? stderr : stdout).trim()));
            });

            return true;
        }
    }
];
