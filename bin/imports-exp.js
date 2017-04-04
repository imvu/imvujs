/* global console: true */
var net = require('net');
var fs = require('fs');

var postcss = require('postcss');
var url = require('postcss-url');
var trim = require("lodash.trim");
var uglify = require('uglify-js2');

var acorn = require('acorn');
var walk = require('acorn/dist/walk');

var times = {
    scan: 0,
    fix: 0,
    parse: 0
};
var cache = {};

function loadModule(filename) {
    var ast = cache[filename];
    if (!ast) {
        var code = fs.readFileSync(filename, 'utf8');
        ast = acorn.parse(code, {
            sourceType: 'module'
        });
    }
    var node = walk.findNodeAt(ast, null, null, function(type, node) {
        return type === 'CallExpression' &&
            node.callee.type === 'Identifier' &&
            node.callee.name === 'module' &&
            node.arguments.length === 2 &&
            node.arguments[0].type === 'ObjectExpression' &&
            node.arguments[1].type === 'FunctionExpression';
    });
    if (node) {
        if (node.node.arguments[0].properties.length)
            cache[filename] = ast;
        return {
            deps: node.node.arguments[0].properties,
            body: node.node.arguments[1]
        };
    } else
        return null;
}

function cleanupRemoteFile(value) {
    if (!value)
        return value;
    if (value.substr(0, 3) === "url") {
        value = value.substr(3);
    }
    value = trim(value, "'\"(), ");
    return value;
}

var atimporturl = postcss.plugin('atimplg', function(options) {

    return function(css) {
        options = options || {};
        var registry = options.registry;
        css.walkAtRules('import', function(rule) {
            var params = postcss.list.space(rule.params);
            var p = cleanupRemoteFile(params[0]);
            if (!registry.hasOwnProperty(p))
                registry[p] = '___$$$_URL_$$$___' + (options.index++) + '__';
            rule.params = 'url(' + registry[p] + ')';
        });
    };
});

var server = net.createServer(function(socket) {
    // Handle incoming messages from clients.
    socket.on('data', function(data) {
        var command = data.toString();
        var t1 = Date.now();
        //console.log(command);
        if (command.match(/^scan /)) {
            try {
                socket.write(scan_dependencies(command.substr(5)));
            } catch (e) {
                socket.write(JSON.stringify({
                    'error': e.message
                }));
            }
            socket.end();
            times.scan += Date.now() - t1;
        } else if (command.match(/^fix /)) {
            try {
                var params = JSON.parse(command.substr(4));
                replace_imports(params.i, params.o, params.p);
                socket.write('done');
            } catch (e) {
                socket.write('failed');
            }
            socket.end();
            times.fix += Date.now() - t1;
        } else if (command.match(/^parse /)) {
            try {
                var fname = command.substr(6);
                fs.readFile(fname, 'utf8', function(e, d) {
                    if (d) {
                        var options = {
                            index: 1,
                            registry: {}
                        };
                        var output = postcss()
                            .use(atimporturl(options))
                            .use(url({
                                url: function(purl, decl, from, dirname, to, opts, result) {
                                    var params = postcss.list.space(decl.value);
                                    var nested = !params.some(function(pp) {
                                        if (pp.startsWith("url")) {
                                            var px = cleanupRemoteFile(pp);
                                            if (px.indexOf(purl) === 0)
                                                return true;
                                        }
                                        return false;
                                    });
                                    if (nested)
                                        return purl;

                                    var p = purl;
                                    if (!options.registry[p])
                                        options.registry[p] = '___$$$_URL_$$$___' + (++options.index) + '__';
                                    return options.registry[p];
                                }
                            }))
                            .process(d, {});
                        socket.write(JSON.stringify({
                            urls: options.registry,
                            css: output.css
                        }));
                    } else {
                        socket.write(JSON.stringify({}));
                    }
                    socket.end();
                    times.parse += Date.now() - t1;
                });
            } catch (e) {
                socket.write(JSON.stringify({}));
                socket.end();
            }

        } else if (command.match(/^shutdown/)) {
            socket.end();
            server.close();
            console.log(times);
            console.log('Server closed by client');
        }
    });

});

var port = process.argv.length > 2 ? process.argv[2] : '/tmp/bb-imports.sock';
server.listen(port);

process.on('SIGTERM', function() {
    console.log('Server closed');
    server.close(function() {
        fs.unlinkSync(process.arv[2]);
    });
});

console.log("import server running at " + port + "\n");

function replace_imports(input, output, replacements) {
    var ast = cache[input];
    delete cache[input];
    if (!ast) {
        var code = fs.readFileSync(input, 'utf8');
        ast = acorn.parse(code, {
            sourceType: 'module'
        });
    }
    var node = walk.findNodeAt(ast, null, null, function(type, node) {
        return type === 'CallExpression' &&
            node.callee.type === 'Identifier' &&
            node.callee.name === 'module' &&
            node.arguments.length === 2 &&
            node.arguments[0].type === 'ObjectExpression' &&
            node.arguments[1].type === 'FunctionExpression';
    });

    node.node.arguments[0].properties.forEach(function(o) {
        if (replacements.hasOwnProperty(o.value.value))
            o.value.value = replacements[o.value.value];
    });
    var new_ast = uglify.AST_Node.from_mozilla_ast(ast);

    fs.writeFileSync(output, new_ast.print_to_string());
}

function scan_dependencies(input) {
    var module;
    module = loadModule(input);
    return module ? module.deps.map(function(e) {
        return e.value.value;
    }).join('\n') : '';
}
