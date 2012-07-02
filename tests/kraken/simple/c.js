
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

    _importOld('/common/js/jquery-1.4.4/jquery.js', '$', gotjQuery);

    function gotjQuery(jQuery) {
        _importJsOddly('/common/js/imvu_rest.js', onImported.bind(null, jQuery));
    }

    function onImported($, rest) {
        IMVU.Rest.ajax({
            type: "POST",
            contentType: "application/json",
            url: "http://api.localhost.imvu.com/rendered_template/",
            data: JSON.stringify({
                "filename": "/vstream/templates/text_post.tml",
                "data": textPostData
            }),
            success: function (response) {
                var $html = $(response.data.html).wrap('<div id="ye-olde-vstream-elements">').parent();
                $('#qunit-fixture').append($html);
                onComplete(null, null);
            }
        });
    }
}

_module([], function() {
    window.trace.push('c');
    return {
        invoke: function() {
            console.log("c.js here");
        }
    };
});
