/*global leprechaun*/

var tests = leprechaun.args.slice(2);
var trampoline = leprechaun.args[1];

var count = 0;

var testframe = document.createElement('iframe');
testframe.style = 'position: absolute; left: 0; top: 0; width: 100%; height: 100%;';
testframe.width = '100%';
testframe.height = '900px';
testframe.addEventListener('load', function () {
    testframe.contentWindow.addEventListener('TestComplete', next, true);
    testframe.contentWindow.addEventListener('message', onMessage, true);
}, true);

document.body.appendChild(testframe);

leprechaun.log('Running '+ tests.length + ' tests.');

function getTime(){
    return (Date.now() / 1000.0);
}

var overallStartTime = getTime();
var individualStartTime;

next();

function next() {
    if (tests.length === 0) {
        leprechaun.log('No tests remain.  Exiting.');
        leprechaun.log('Total time: ' + (getTime() - overallStartTime).toFixed(3) + 's');
        leprechaun.exit(0);
    } else {
        ++count;

        var nextTest = tests.shift();
        var url = trampoline + '?count=' + count + '#/' + nextTest;

        leprechaun.log('Running test: ' + url);
        individualStartTime = getTime();
        testframe.contentWindow.location.assign(url);
    }
}

function onMessage(evt) {
    var msg = JSON.parse(evt.data);

    switch (msg.type) {
    case 'all-tests-complete':
        leprechaun.log('Test Complete! ' + (getTime() - individualStartTime).toFixed(3) + 's');
        leprechaun.log('------------------------------');
        return next();
    case 'test-start':
        return undefined;
    case 'test-complete':
        if (msg.verdict === "FAIL"){
            leprechaun.log('FAILURE in test: "' + msg.name + '"');

            msg.stack.split('\n').forEach(function(line){
                leprechaun.log(line);
            });

            leprechaun.exit(1);
            return void 1;
        } else if (msg.verdict === "PASS"){
            return undefined;
        }
        break;
    }
    leprechaun.log('unknown message type: '+ msg.type);
    return undefined;
}

function onNewBrowser() {
}
