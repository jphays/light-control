var Color = require('color');

exports.fade = function(from, to, startTime, duration, state, options)
{
    var output = [];

    for (var i = 0; i < from.length && i < to.length; i++)
    {
        output.push(Color(from[i]).mix(Color(to[i]), (state.time - startTime) / duration));
    }

    return output;
}