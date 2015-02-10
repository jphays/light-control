var _ = require('lodash');
var Color = require('color');
var palettes = require('../palettes');

var palette = palettes.triadicScheme({ h: _.random(360), s: 100, v: 80 });

var pixels = [];
var changeInterval = 1200;

function init(options)
{
    for (var i = 0; i < options.ledCount; i++)
    {
        pixels[i] = {
            colorIndex: palette.length - 1,
            color: Color("black"),
            changeTime: 5 * i,
            lastChangeTime: 0
        };
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

        pixel.color = envelope(pixel.lastChangeTime, state,
            { color: palette[pixel.colorIndex].clone() });
    });

    return pixels.map(function(pixel) { return pixel.color; });

}

// An ADSR (attack/decay/sustain/release) envelope for a color.
function envelope(startTime, state, options)
{

    options = _.defaults(options, {
        startColor: "black",
        attackColor: "white",
        color: "white",
        releaseColor: "black",
        attackTime: 100,
        decayTime: 250,
        sustainTime: 400,
        releaseTime: 300
    });

    var timeSinceStart = state.time - startTime;

    var decayStart = options.attackTime;
    var sustainStart = decayStart + options.decayTime;
    var releaseStart = sustainStart + options.sustainTime;
    var releaseEnd = releaseStart + options.releaseTime;

    if (timeSinceStart < decayStart)
    {
        return Color(options.startColor).mix(
                    Color(options.attackColor),
                    timeSinceStart / options.attackTime);
    }
    else if (timeSinceStart < sustainStart)
    {
        return Color(options.attackColor).mix(
                    Color(options.color),
                    (timeSinceStart - decayStart) / options.decayTime);
    }
    else if (timeSinceStart < releaseStart)
    {
        return Color(options.color);
    }
    else if (timeSinceStart < releaseEnd)
    {
        return Color(options.color).mix(
                    Color(options.releaseColor),
                    (timeSinceStart - releaseStart) / options.releaseTime);
    }
    else
    {
        return Color(options.releaseColor);
    }

}

exports.init = init;
exports.render = render;