var Color = require('color');

function crossfade(from, to, startTime, duration, state, options)
{
    var output = [];
    var position = (state.time - startTime) / duration;

    for (var i = 0; i < from.length && i < to.length; i++)
    {
        output.push(Color(from[i]).mix(Color(to[i]), position));
    }

    return output;
}

function fadeout(from, to, startTime, duration, state, options)
{
    var output = [];
    var position = (state.time - startTime) / duration;

    for (var i = 0; i < from.length && i < to.length; i++)
    {
        if (position < 0.5)
        {
            output.push(Color(from[i]).mix(Color(options.color || "black"), position * 2));
        }
        else
        {
            output.push(Color(options.color || "black").mix(Color(to[i]), (position - 0.5) * 2));
        }
    }

    return output;
}

exports.crossfade = crossfade;
exports.fadeout = fadeout;

exports.all = [
    crossfade,
    fadeout
];