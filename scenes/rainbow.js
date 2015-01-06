var Color = require('color');

var sceneLeds = [];

function init(options)
{
    for (var i = 0; i < options.ledCount; i++)
    {
        sceneLeds.push(Color({ h: (i * 5) % 360, s: 100, v: 25 }));
    }
}

function render(state)
{
    for (var i = 0; i < sceneLeds.length; i++)
    {
        sceneLeds[i] = sceneLeds[i].rotate(5);
    }
    return sceneLeds;
}

exports.init = init;
exports.render = render;