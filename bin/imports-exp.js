/*global console*/
var net = require('net');
var fs = require('fs');

var postcss = require('postcss');
var url = require('postcss-url');
var trim = require("lodash.trim");
var combine = require('./combine.js');

var LRU = require("lru-cache"),
   options = { max: 50,
               length: function (n, key) { return 1 << 22; },
               dispose: function (key, n) { },
               maxAge: 1000 * 60 },
   cache = LRU(options),
   otherCache = LRU(50) ; // sets just the max size

var fs = require('fs');
var acorn = require('acorn/dist/acorn_loose');
var walk = require('acorn/dist/walk');

function loadModule(filename) {
    var code = fs.readFileSync(filename, 'utf8');
    var ast;
    var ast = acorn.parse_dammit(code, { sourceType : 'module'});
    var node = walk.findNodeAt(ast, null, null, function(type, node) {
        return type === 'CallExpression' &&
            node.callee.type === 'Identifier' &&
            node.callee.name === 'module' &&
            node.arguments.length === 2 &&
            node.arguments[0].type === 'ObjectExpression' &&
            node.arguments[1].type === 'FunctionExpression';
    });
    return node? { deps: node.node.arguments[0].properties, body: node.node.arguments[1]} : null;
}


function cleanupRemoteFile(value) {
    if(!value)
        return value;
    if (value.substr(0, 3) === "url") {
        value = value.substr(3);
    }
    value = trim(value, "'\"(), ");
    return value;
}

var space = postcss.list.space;

var atimporturl = postcss.plugin('atimplg', function(options) {

    return function(css) {
        options = options || {};
        var registry = options.registry;
        css.walkAtRules('import', function(rule) {
            var params = space(rule.params);
            var p = cleanupRemoteFile(params[0]);
            if(!registry.hasOwnProperty(p))
                registry[p] = '___$$$_URL_$$$___' + (options.index++);
            rule.params = 'url(' + registry[p] + ')';
        });
/*
        css.walkDecls(/^(src|background|filter|list-style|behavior|cursor)/, decl => {
            var val = decl.value;
            if(val.indexOf('url(') >= 0) {
                var ps = space(val);
                ps.forEach( (p, indx, arr) => {
                    if(p.indexOf('url(') == 0) {
                        var purl = cleanupRemoteFile(p);
                        if(!options.registry.hasOwnProperty(purl))
                            options.registry[purl] = '___$$$_URL_$$$___' + (options.index++);
                        arr[indx] = options.registry[purl];
                    }
                });
                decl.value = ps.join(' ');
            }
        });
        */
    };
});

var server = net.createServer(function(socket) {
  // Handle incoming messages from clients.
  socket.on('data', function(data) {
    var command = data.toString();
    console.log(command);
    if(command.match(/^scan /)) {
        try {
          socket.write(scan_dependencies(command.substr(5)));
          socket.end();
        }
        catch(e) {
          socket.write(JSON.stringify({'error' : e.message}));
          socket.end();
        }
    }
    else if(command.match(/^scan2 /)) {
        try {
          socket.write(scan_dependencies2(command.substr(6)));
          socket.end();
        }
        catch(e) {
          socket.write(JSON.stringify({'error' : e.message}));
          socket.end();
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
            fs.readFile(fname, 'utf8', function(e, d) {
            if(d) {
                var options = {index:1, registry: {}};
                var output = postcss()
                  .use(atimporturl(options))
                  .use(url({url : function(purl, decl, from, dirname, to, opts, result) {
                    var params = space(decl.value);
                    var nested = !params.some(function(pp) {
                        if(pp.startsWith("url")) {
                            var px = cleanupRemoteFile(pp);
                            if(px.indexOf(purl) === 0)
                                return true;
                        }           
                        return false;
                    }
                    );
                    if(nested)
                        return purl;

                    var p = purl;
                    if(!options.registry[p])
                        options.registry[p] = '___$$$_URL_$$$___' + (++options.index);
                    return options.registry[p];
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

process.on('SIGTERM', function() {
  console.log('Server closed');
  server.close(function() { fs.unlinkSync(process.arv[2]); });
}); 

console.log("import server running at " + port + "\n");

var fs  = require('fs');

function replace_imports(input, output, replacements) {
    var module;

    if(cache.has(input))
        module = cache.get(input);
    else {
        module = combine.loadModule(input);
        cache.set(input, module, 1000 * 60);
    }
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

function scan_dependencies(input) {
    var module;
    module = loadModule(input);

    return module ? module.deps.map(function(e) { return e.value.value; }).join('\n') : '';
}

function scan_dependencies2(input) {
    var module;
    var depstr = '';
    try {
        if(cache.has(input))
            module = cache.get(input);
        else {
            module = combine.loadModule(input);
            cache.set(input, module, 1000 * 60);
        }
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
    return depstr;
}

