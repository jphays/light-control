var _ = require('lodash');
var Color = require('color');
var effects = require('../effects');
var palettes = require('../palettes');

var palette;
var pixels = [];
var changeInterval = 1200;

function init(options)
{
    pixels = [];
    palette = options.palette || palettes.triadicScheme({ h: _.random(360), s: 100, v: 80 });

    for (var i = 0; i < options.ledCount; i++)
    {
        pixels.push({
            colorIndex: palette.length - 1,
            color: Color("black"),
            changeTime: i * i * Math.sin(i) * 0.1,
            lastChangeTime: 0
        });
    }
}

function render(state)
{

    // first run
    if (pixels[0].changeTime == 0)
    {
        pixels.forEach(function(pixel, i)
        {
            pixel.changeTime += state.time;
        });
    }

    pixels.forEach(function(pixel, i)
    {
        // time to change?
        if (state.time >= pixel.changeTime)
        {
            pixel.colorIndex = (pixel.colorIndex + 1) % palette.length;
            pixel.changeTime += changeInterval;
            pixel.lastChangeTime = state.time;
        }

        pixel.color = effects.envelope(pixel.lastChangeTime, state,
            { color: palette[pixel.colorIndex].clone() });
    });

    return pixels.map(function(pixel) { return pixel.color; });

}

exports.init = init;
exports.render = render;
