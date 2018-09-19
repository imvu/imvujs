module({
}, function(imports) {
    fixture('dom tests', function() {
        this.tearDown(function() {
            $('.test-sandbox').html('');
        });

        test('present', function() {
            $('.test-sandbox').append('<div class="widget"></div>');
            assert.dom.present('.test-sandbox .widget');
        });

        test('notPresent', function() {
            assert.dom.notPresent('.test-sandbox .widget');
        });

        test('hasTag', function() {
            $('.test-sandbox').append('<p class="para"></p>');
            assert.dom.hasTag('p', '.test-sandbox .para');
        });

        test('hasClass', function() {
            $('.test-sandbox').append('<div class="widget hidden"></div>');
            assert.dom.hasClass('hidden', '.test-sandbox .widget');
        });

        test('notHasClass', function() {
            $('.test-sandbox').append('<div class="widget"></div>');
            assert.dom.notHasClass('hidden', '.test-sandbox .widget');
        });

        test('hasAttribute', function() {
            $('.test-sandbox').append('<img data-src="test">');
            assert.dom.hasAttribute('data-src', '.test-sandbox img');
        });

        test('notHasAttribute', function() {
            $('.test-sandbox').append('<img data-src="test">');
            assert.dom.notHasAttribute('src', '.test-sandbox img');
        });

        test('attr', function() {
            $('.test-sandbox').append('<img data-src="test">');
            assert.dom.attr('test', 'data-src', '.test-sandbox img');
        });

        test('prop', function() {
            $('.test-sandbox').append('<input disabled>');
            assert.dom.prop(true, 'disabled', '.test-sandbox input');
            assert.dom.prop(undefined, 'idonotexist', '.test-sandbox input');
        });

        test('attributeValues', function() {
            $('.test-sandbox').append('<input placeholder="test" value="foo" disabled>');
            assert.dom.attributeValues({
                placeholder: 'test',
                disabled: 'disabled',
            }, '.test-sandbox input');
        });

        test('text', function() {
            assert.dom.text('', '.test-sandbox');
            $('.test-sandbox').text('hello');
            assert.dom.text('hello', '.test-sandbox');
        });

        test('value', function() {
            $('.test-sandbox').append('<input value="foo">');
            assert.dom.value('foo', '.test-sandbox input');
            $('.test-sandbox input').val('bar');
            assert.dom.value('bar', '.test-sandbox input');
        });

        test('count', function() {
            $('.test-sandbox').append('<p></p><p></p><img>');
            assert.dom.count(2, '.test-sandbox p');
            assert.dom.count(1, '.test-sandbox img');
            assert.dom.count(0, '.test-sandbox form');
        });

        test('visible', function() {
            $('.test-sandbox').append('<div class="widget">x</div>');
            assert.dom.visible('.test-sandbox .widget');
        });

        test('still considered visible if zero opacity', function() {
            $('.test-sandbox').append('<div class="widget" style="opacity:0"></div>');
            assert.dom.visible('.test-sandbox .widget');
        });

        test('still considered visible of no size', function() {
            $('.test-sandbox').append('<div class="widget" style="width:0;height:0;"></div>');
            assert.dom.visible('.test-sandbox .widget');
        });

        test('still considered visible if visibility hidden', function() {
            $('.test-sandbox').append('<div class="widget" style="visibility:hidden"></div>');
            assert.dom.visible('.test-sandbox .widget');
        });

        test('notVisible if display none', function() {
            $('.test-sandbox').append('<div class="widget" style="display:none"></div>');
            assert.dom.notVisible('.test-sandbox .widget');
        });

        test('disabled', function() {
            $('.test-sandbox').append('<input class="a" disabled><input class="b">');
            assert.dom.disabled('.test-sandbox .a');
            $('.test-sandbox .b').prop('disabled', true);
            assert.dom.disabled('.test-sandbox .b');
        });

        test('enabled', function() {
            $('.test-sandbox').append('<input class="a"><input class="b" disabled>');
            assert.dom.enabled('.test-sandbox .a');
            $('.test-sandbox .b').prop('disabled', false);
            assert.dom.enabled('.test-sandbox .b');
        });

        test('focused', function() {
            $('.test-sandbox').append('<input class="a"><input class="b">');
            $('.test-sandbox .a').focus();
            assert.dom.focused('.test-sandbox .a');
            $('.test-sandbox .b').focus();
            assert.dom.focused('.test-sandbox .b');
        });

        test('notFocused', function() {
            $('.test-sandbox').append('<input class="a"><input class="b">');
            $('.test-sandbox .a').focus();
            assert.dom.notFocused('.test-sandbox .b');
            $('.test-sandbox .b').focus();
            assert.dom.notFocused('.test-sandbox .a');
        });

        test('html', function() {
            var text = document.createTextNode('hi');
            var div = document.createElement('div');
            div.textContent = 'bye';
            $('.test-sandbox').append(text);
            $('.test-sandbox').append(div);
            assert.dom.html('hi<div>bye</div>', '.test-sandbox');
        });

        test('css', function() {
            $('.test-sandbox').append('<div style="width:1.5px;opacity:1.0;color:red;"></div>');
            assert.dom.css('1.5px', 'width', '.test-sandbox div');
            assert.dom.css('1', 'opacity', '.test-sandbox div');
            assert.dom.css('rgb(255, 0, 0)', 'color', '.test-sandbox div');
        });

        test('cssPx', function() {
            $('.test-sandbox').append('<div class="a" style="width:1px;"></div><div class="b" style="width:1.5px"></div>');
            assert.dom.cssPx(1, 'width', '.test-sandbox .a');
            assert.dom.cssPx(1.5, 'width', '.test-sandbox .b');
        });

        test('cssPxNear', function() {
            $('.test-sandbox').append('<div class="a" style="width:1.7px;">');
            $('.test-sandbox').append('</div><div class="b" style="width:314px"></div>');
            assert.dom.cssPxNear(1.5, 'width', '.test-sandbox .a', 0.2);
            assert.dom.cssPxNear(300, 'width', '.test-sandbox .b', 15);
        });

        test('empty', function() {
            $('.test-sandbox').append('<p></p>');
            assert.dom.empty('.test-sandbox p');
        });

        test('notEmpty', function() {
            $('.test-sandbox').append('<p>x</p>');
            assert.dom.notEmpty('.test-sandbox p');
        });

        test('pseudoElementCss', function() {
            $('.test-sandbox').append('<div class="widget"></div><style>.test-sandbox .widget::after { content: \'hi\'; }</style>');
            assert.dom.pseudoElementCss('hi', 'content', '.test-sandbox .widget', 'after');
        });
    });
});
