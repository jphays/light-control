var Color = require('color');
var _ = require('lodash');

var palette = [
    Color("#000000"), // black
    Color("#b00000"), // red
    Color("#a02000"), // orange
    Color("#806000"), // yellow
    Color("#005000"), // green
    Color("#004020"), // teal
    Color("#0000a0"), // blue
    Color("#200080"), // purple
    Color("#90a090")  // white
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