
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

    kraken.importJs('/common/js/jquery-1.7.2/jquery.js', gotjQuery);

    function gotjQuery() {
        console.log('gotjQuery');
        kraken.importJs('/common/js/easyXDM-2.4.15.118/easyXDM.js', gotEasyXdm);
    }

    function gotEasyXdm() {
        console.log('gotEasyXdm');
        kraken.importJs('/common/js/imvu_rest.js', onImported);
    }

    function onImported(rest) {
        rest.ajax({
            type: "POST",
            contentType: "application/json",
            url: "http://api.localhost.imvu.com/rendered_template/",
            data: JSON.stringify({
                "filename": "/vstream/templates/text_post.tml",
                "data": textPostData
            }),
            complete: function(jqxhr, textStatus) {
                console.log("hello");
            },
            success: onComplete
        }, {sauce: 'aoeuaoeu'});
    }
}

module({template: getTemplate}, function(imports) {
    window.trace.push('a');
    return {
        invoke: function() {
            window.trace.push('invoke');
            window.trace.push(imports.template.status);
            console.log("a.js here", imports.template);
        }
    };
});
