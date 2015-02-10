var _ = require('lodash');
var Color = require('color');

// An ADSR (attack/decay/sustain/release) envelope for a color.
exports.envelope = function(startTime, state, options)
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

