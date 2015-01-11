var Color = require('color');
var _ = require('lodash');

var palette = [
    Color({ h: 0, s: 0, v: 0}), // black
    Color({ h: 0, s: 100, v: 85 }), // red
    Color({ h: 12, s: 100, v: 85 }), // orange
    Color({ h: 45, s: 100, v: 85 }), // yellow
    Color({ h: 120, s: 100, v: 85 }), // green
    Color({ h: 150, s: 100, v: 85 }), // teal
    Color({ h: 240, s: 100, v: 85 }), // blue
    Color({ h: 255, s: 100, v: 85 }), // purple
    Color({ h: 120, s: 8, v: 85 })  // white
];

var changeTimes = [];
var colorIndexes = [];
var sceneLeds = [];

var groupSize = 5;
var changeTimeMin = 500;
var changeTimeMax = 750;

function init(options)
{
    var initialChangeTime = Date.now();
    var colorIndex = _.random(0, palette.length);

    for (var i = 0; i < options.ledCount; i++)
    {
        changeTimes.push(initialChangeTime);
        colorIndexes.push(colorIndex);
        sceneLeds.push(Color(palette[colorIndex]).clone());

        if (i % groupSize == groupSize - 1)
        {
            colorIndex = _.random(0, palette.length);
        }
    }
}

function render(state)
{
    for (var i = 0; i < sceneLeds.length; i++)
    {
        // time close to elapsed? start fading
        if (state.time >= changeTimes[i] - 300)
        {
            sceneLeds[i].darken(0.6);
        }

        // time elapsed? cycle the led to the next color
        if (state.time >= changeTimes[i])
        {
            colorIndexes[i] = (colorIndexes[i] + 1) % palette.length;
            sceneLeds[i] = Color(palette[colorIndexes[i]]).clone();
            changeTimes[i] = state.time + _.random(changeTimeMin, changeTimeMax, true);
        }
    }
    return sceneLeds;
}

exports.init = init;
exports.render = render;