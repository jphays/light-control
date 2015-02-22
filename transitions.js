var _ = require('lodash');
var Color = require('color');

function crossfade(from, to, position, options)
{
    var output = [];

    for (var i = 0; i < from.length && i < to.length; i++)
    {
        output.push(Color(from[i]).mix(Color(to[i]), position));
    }

    return output;
}

function fadeout(from, to, position, options)
{
    _.defaults(options, { color: "#EEE" });

    var output = [];

    for (var i = 0; i < from.length && i < to.length; i++)
    {
        if (position < 0.5)
        {
            output.push(Color(from[i]).mix(Color(options.color), position * 2));
        }
        else
        {
            output.push(Color(options.color).mix(Color(to[i]), (position - 0.5) * 2));
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