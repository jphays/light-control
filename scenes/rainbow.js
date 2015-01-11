var Color = require('color');

var sceneLeds = [];

function init(options)
{
    for (var i = 0; i < options.ledCount; i++)
    {
        sceneLeds.push(Color({ h: (i * 5) % 360, s: 100, v: 85 }));
    }
}

function render(state)
{
    var value = (Math.sin(state.time / 1000) + 1) * 30 + 30;
    sceneLeds.forEach(function(led) { led.rotate(1); });
    return sceneLeds;
}

exports.init = init;
exports.render = render;