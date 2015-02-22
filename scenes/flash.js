var _ = require('lodash');
var Color = require('color');
var effects = require('../effects');
var palettes = require('../palettes');

var palette;
var pixels = [];
var changeInterval = 1200;
var firstRun = true;

function init(options)
{
    pixels = [];
    palette = options.palette || palettes.randomPalette();
    firstRun = true;

    var initFunc = _.sample(initFuncs);

    for (var i = 0; i < options.ledCount; i++)
    {
        pixels.push({
            colorIndex: palette.length - 1,
            color: Color("black"),
            changeTime: initFunc(i),
            lastChangeTime: 0
        });
    }
}

function render(state)
{

    if (firstRun)
    {
        pixels.forEach(function(pixel, i)
        {
            pixel.changeTime += state.time;
        });
        firstRun = false;
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

var initFuncs = [
    function(i) { return i; },
    function(i) { return 5 * i; },
    function(i) { return i * i * 0.1; },
    function(i) { return i * i * i * 0.01; },
    function(i) { return i * i * Math.sin(i) * 0.1; },
    function(i) { return _.random(200); },
    function(i) { return _.random(1000); },
    function(i) { return i * _.random(100); }
];

exports.init = init;
exports.render = render;
