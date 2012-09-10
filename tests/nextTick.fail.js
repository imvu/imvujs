test(function cannot_call_process_nextTick() {
    process.nextTick(function(){});
});
