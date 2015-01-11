var Color = require('color');
var _ = require('lodash');

var palette = [
    Color({ h: 0, s: 100, v: 85 }), // red
    Color({ h: 12, s: 100, v: 85 }), // orange
    Color({ h: 45, s: 100, v: 85 }), // yellow
    Color({ h: 120, s: 100, v: 85 }), // green
    Color({ h: 150, s: 100, v: 85 }), // teal
    Color({ h: 240, s: 100, v: 85 }), // blue
    Color({ h: 255, s: 100, v: 85 }), // purple
];

var pixels = [];
var changeInterval = 1000;


function init(options)
{
    for (var i = 0; i < options.ledCount; i++)
    {
        pixels[i] = {
            colorIndex: 0,
            color: palette[0].clone(),
            changeTime: 10 * i,
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
            pixel.lastChangeTime = state.time;
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
        pixel.color = colorVal(pixel.colorIndex, timeSinceChange);
    });

    return pixels.map(function(pixel) { return pixel.color; });

}

// Gets a specific color based on a palette index and the time since the last
// change. Fades in from white (attack) and fades out to black (release).
// TODO: extract this into some kind of generalized ADSR function.
function colorVal(colorIndex, timeSinceChange)
{

    var color = palette[colorIndex].clone();
    if (timeSinceChange < 200)
    {
        return color.mix(Color("white"), 1 - (timeSinceChange / 200));
    }
    else if (timeSinceChange > 700)
    {
        return color.mix(Color("black"), (timeSinceChange - 700) / 200);
    }
    else
    {
        return color;
    }

}

exports.init = init;
exports.render = render;