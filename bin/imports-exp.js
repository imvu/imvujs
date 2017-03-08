/*global console*/
var net = require('net');
var fs = require('fs');

var postcss = require('postcss');
var url = require('postcss-url');
var trim = require("lodash.trim");

function cleanupRemoteFile(value) {
    if (value.substr(0, 3) === "url") {
        value = value.substr(3);
    }
    value = trim(value, "'\"()");
    return value;
}

var space = postcss.list.space;

var atimporturl = postcss.plugin('myplugin', function (options) {

    return function (css) {
        options = options || {};
        var registry = options.registry;
        css.walkAtRules('import', function (rule) {
            var params = space(rule.params);
            var p = cleanupRemoteFile(params[0]);
            if(!registry[p])
                registry[p] = '___$$$_URL_$$$___' + (++options.index);
            rule.params = 'url(' + registry[p] + ')';
        });
    };
});

var server = net.createServer(function (socket) {
 
  // Handle incoming messages from clients.
  socket.on('data', function (data) {
    var command = data.toString();
    if(command.match(/^scan /)) {
        try {
          socket.write(scan_dependencies(command.substr(5)));
          socket.end();
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
        socket.end();
    }
    else if(command.match(/^parse /)) {
        try {
            var fname = command.substr(6);
            console.log(command);
            fs.readFile(fname, 'utf8', function(e, d) {
            if(d) {
                var options = {index:1, registry: {}};
                var output = postcss()
                  .use(atimporturl(options))
                  .use(url({url : function(URL, decl, from, dirname, to, opts) {
                    if(!options.registry[URL])
                        options.registry[URL] = '___$$$_URL_$$$___' + (++options.index);
                        return options.registry[URL];
                    }})
                  )
                  .process(d, {});
                socket.write(JSON.stringify({urls: options.registry, 
                    css: output.css}));
                socket.end();
            }
            else {
                socket.write(JSON.stringify({}));
                socket.end();
            }
            });
        }
        catch(e) {
          socket.write(JSON.stringify({}));
          socket.end();
        }

    }
    else if(command.match(/^shutdown/)) {
       socket.end();
       server.close();
       console.log('Server closed by client');
    }
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

