
var fs = require('fs');
var uglify = require('uglify-js');

var code = fs.readFileSync(process.argv[2], 'utf8');
var ast = uglify.parser.parse(code);
console.log("AST");
console.log(JSON.stringify(ast));
