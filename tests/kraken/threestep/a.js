
var textPostData = {
    login_cid: 123,
    comments: [],
    element_key: "0000001",
    show_likes: true,
    total_likes: 1002,
    total_likes_label: "1k"
};

function getTemplate(onComplete) {
    console.log("getTemplate");

    kraken.importOld('/common/js/jquery-1.7.2/jquery.js', gotjQuery);

    function gotjQuery() {
        console.log('gotjQuery');
        kraken.importOld('/common/js/imvu_rest.js', onImported);
    }

    function onImported(rest) {
        IMVU.Rest.ajax({
            type: "POST",
            contentType: "application/json",
            url: "http://api.localhost.imvu.com/rendered_template/",
            data: JSON.stringify({
                "filename": "/vstream/templates/text_post.tml",
                "data": textPostData
            }),
            success: onComplete
        }, {sauce: 'aoeuaoeu'});
    }
}

module([getTemplate], function(template) {
    window.trace.push('a');
    return {
        invoke: function() {
            window.trace.push('invoke');
            window.trace.push(template.status);
            console.log("a.js here", template);
        }
    };
});
