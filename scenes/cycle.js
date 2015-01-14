var _ = require('lodash');
var Color = require('color');
var palettes = require('../palettes');

var palette = palettes.rainbowBW;

var pixels = [];

var groupSize = 5;
var changeTimeMin = 500;
var changeTimeMax = 750;

function init(options)
{
    var initialChangeTime = Date.now();
    var colorIndex = _.random(0, palette.length);

    for (var i = 0; i < options.ledCount; i++)
    {
        pixels.push({
            colorIndex: colorIndex,
            color: palette[colorIndex].clone(),
            changeTime: initialChangeTime
        });

        if (i % groupSize == groupSize - 1)
        {
            colorIndex = _.random(0, palette.length);
        }
    }
}

function render(state)
{
    pixels.forEach(function(pixel, i)
    {
        // time close to elapsed? start fading
        if (state.time >= pixel.changeTime - 300)
        {
            pixel.color.darken(0.6);
        }

        // time elapsed? cycle the led to the next color
        if (state.time >= pixel.changeTime)
        {
            pixel.colorIndex = (pixel.colorIndex + 1) % palette.length;
            pixel.color = palette[pixel.colorIndex].clone();
            pixel.changeTime = state.time + _.random(changeTimeMin, changeTimeMax, true);
        }
    });

    return pixels.map(function(pixel) { return pixel.color; });
}

exports.init = init;
exports.render = render;