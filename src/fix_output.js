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
