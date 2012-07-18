
var textPostData = {
    login_cid: 123,
    comments: [],
    element_key: "0000001",
    show_likes: true,
    total_likes: 1002,
    total_likes_label: "1k"
};

function getjQuery(onComplete) {
    console.log("getjQuery");

    kraken.importJs('/common/js/jquery-1.7.2/jquery.js', gotjQuery);

    function gotjQuery() {
        window.trace.push('jQuery');
        onComplete(null, null);
    }
}

module([getjQuery], function() {
    window.trace.push('a');
    return {
        invoke: function() {
            window.trace.push('invoke');
            console.log("a.js here");
        }
    };
});
