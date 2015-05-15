/*global console*/
var net = require('net');
 
var server = net.createServer(function (socket) {
 
  // Handle incoming messages from clients.
  socket.on('data', function (data) {
    var command = data.toString();
    if(command.match(/^scan /)) {
        try {
          socket.write(scan_dependencies(command.substr(5)));
        }
        catch(e) {
        }
    }
    else if(command.match(/^fix /)) {
        try {
          var params = JSON.parse(command.substr(4));
          replace_imports(params.i, params.o, params.p);
          socket.write('done');
        }
        catch(e) {
          socket.write('failed');
        }
    }
    else if(command.match(/^shutdown/)) {
       server.close();
       console.log('Server closed by client');
    }
    socket.end();
  });
  
});

var port = process.argv.length > 2? process.argv[2]:'/tmp/bb-imports.sock';
server.listen(port);

process.on('SIGTERM', function () {
  console.log('Server closed');
  server.close(function () {
  });
}); 

console.log("import server running at " + port + "\n");

var fs     = require('fs');
var combine = require('./combine.js');

function replace_imports(input, output, replacements) {
    var module = combine.loadModule(input);
    var deps = module.deps;
    var new_deps = {};
    for (var m in deps) {
        if (Object.prototype.hasOwnProperty.call(deps, m)) {
            var dep = deps[m];
            if (Object.prototype.hasOwnProperty.call(replacements, dep)) {
                dep = replacements[dep];
            }
            new_deps[m] = dep;
        }
    }

    var new_module = {
        body: module.body,
        deps: new_deps
    };
    var new_ast = combine.saveModule(new_module);

    // TODO: this could be a commandline arg, but then we'd have to have sane argument parsing below.
    fs.writeFileSync(output, combine.gen_code(new_ast, {beautify: /\.min\.js$/.exec(input) === null}));
}

function scan_dependencies(rootPath) {
    var module;
    var depstr = '';
    try {
        module = combine.loadModule(rootPath);
    }
    catch (e) {
        if (e instanceof combine.ScriptError) {
            return depstr;
        } else {
            throw e;
        }
    }

    var deps = module.deps;
    for (var m in deps) {
        if (Object.prototype.hasOwnProperty.call(deps, m)) {
            depstr += deps[m] + '\n';
        }
    }
    console.log(depstr);
    return depstr;
}

