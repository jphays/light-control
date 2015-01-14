var _ = require('lodash');
var Color = require('color');
var palettes = require('../palettes');

var palette = palettes.rainbow;

var pixels = [];
var changeInterval = 1200;

function init(options)
{
    for (var i = 0; i < options.ledCount; i++)
    {
        pixels[i] = {
            colorIndex: palette.length - 1,
            color: palette[0].clone(),
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
            //pixel.lastChangeTime = state.time;
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

        var timeSinceChange = state.time - pixel.lastChangeTime;
        pixel.color = envelope(
            { timeSinceChange: timeSinceChange },
            { color: palette[pixel.colorIndex].clone() });
    });

    return pixels.map(function(pixel) { return pixel.color; });

}

// An ADSR (attack/decay/sustain/release) envelope for a color.
// State should contain the time since the envelope fired.

function envelope(state, options)
{

    options = _.defaults(options, {
        startColor: "black",
        attackTime: 100,
        attackColor: "white",
        decayTime: 250,
        sustainTime: 400,
        color: "red",
        releaseTime: 350,
        releaseColor: "black"
    });

    var decayStart = options.attackTime;
    var sustainStart = decayStart + options.decayTime;
    var releaseStart = sustainStart + options.sustainTime;
    var releaseEnd = releaseStart + options.releaseTime;

    if (state.timeSinceChange < decayStart)
    {
        return Color(options.startColor).mix(
                    Color(options.attackColor),
                    state.timeSinceChange / options.attackTime);
    }
    else if (state.timeSinceChange < sustainStart)
    {
        return Color(options.attackColor).mix(
                    Color(options.color),
                    (state.timeSinceChange - decayStart) / options.decayTime);
    }
    else if (state.timeSinceChange < releaseStart)
    {
        return Color(options.color);
    }
    else if (state.timeSinceChange < releaseEnd)
    {
        return Color(options.color).mix(
                    Color(options.releaseColor),
                    (state.timeSinceChange - releaseStart) / options.releaseTime);
    }
    else
    {
        return Color(options.releaseColor);
    }

}

exports.init = init;
exports.render = render;