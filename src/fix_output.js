var fs = require('fs');
var util = require('util');

exports.syncWriteStdout = function(data) {
    fs.writeSync(1, data);
};
exports.syncWriteStderr = function(data) {
    fs.writeSync(2, data);
};

exports.fixConsole = function(console) {
    console.log = function() {
        exports.syncWriteStdout(util.format.apply(this, arguments) + '\n');
    };
    console.info = console.log;

    console.warn = function() {
        exports.syncWriteStderr(util.format.apply(this, arguments) + '\n');
    };
    console.error = console.warn;

    console.dir = function(object) {
        exports.syncWriteStdout(util.inspect(object) + '\n');
    };
};

exports.fixUtil = function(util) {
    util.puts = function() {
        for (var i = 0, len = arguments.length; i < len; ++i) {
            exports.syncWriteStdout(arguments[i] + '\n');
        }
    };

    util.debug = function(s) {
        exports.syncWriteStderr('DEBUG: ' + s + '\n');
    };

    util.error = function() {
        for (var i = 0, len = arguments.length; i < len; ++i) {
            exports.syncWriteStderr(arguments[i] + '\n');
        }
    };

    
};
