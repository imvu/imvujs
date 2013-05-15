module({
}, function (imports) {
    return {
        // run a chain of continuations in sequence, discarding results
        sequence_: function (funcs, continuation) {
            var i = 0;
            function next() {
                if (i >= funcs.length) {
                    return continuation();
                }
                var current = funcs[i++];
                current(next);
            }
            next();
        }
    };
});
