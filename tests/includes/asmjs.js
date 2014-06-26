module({}, function() {
  return function(x) {
    return+ + +x; // this pattern used to get minified by uglify into +++x, which is a syntax error
  };
});
