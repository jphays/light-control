var _ = require('lodash');
var Color = require('color');

var pixels = [];

function init(options)
{
    var hue = _.random(360);
    pixels = [];
    for (var i = 0; i < options.ledCount; i++)
    {
        pixels.push(Color({ h: hue, s: 100, v: 85 }));
        hue = (hue + 5) % 360;
    }
}

function render(state)
{
    var value = (Math.sin(state.time / 1000) + 1) * 30 + 30;
    pixels.forEach(function(led) { led.rotate(1); });
    return pixels;
}

exports.init = init;
exports.render = render;