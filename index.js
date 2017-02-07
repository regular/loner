var replace = require('binary-stream-replace');
var throughout = require('throughout');
var through = require('through');
var isBuffer = require('isbuffer');

function lonerWithReplacerOptions(options) {
    return function() {
        if (arguments.length === 0) return through();
        var stack = [];
        var args = [].slice.call(arguments);
        args.forEach( function(buf) {
            if (!isBuffer(buf)) {
                if (typeof buf == 'string') {
                    buf = Buffer.from(buf);
                } else throw new Error('Arguments must be Buffers or Strings');
            }
            stack.push(replace(buf, buf, options));
        });
        while(stack.length>1) {
            var combined = throughout(stack.shift(), stack.shift());
            stack.unshift(combined);
        }
        return stack[0];
    };
}

module.exports = lonerWithReplacerOptions({});
module.exports.only = function(n) {
    return lonerWithReplacerOptions({maxOccurrences: n});
};
