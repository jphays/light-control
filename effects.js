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

    if (timeSinceStart < decayStart) // attack
    {
        return Color(options.startColor).mix(
                    Color(options.attackColor),
                    timeSinceStart / options.attackTime);
    }
    else if (timeSinceStart < sustainStart) // decay
    {
        return Color(options.attackColor).mix(
                    Color(options.color),
                    (timeSinceStart - decayStart) / options.decayTime);
    }
    else if (timeSinceStart < releaseStart) // sustain
    {
        return Color(options.color);
    }
    else if (timeSinceStart < releaseEnd) // release
    {
        return Color(options.color).mix(
                    Color(options.releaseColor),
                    (timeSinceStart - releaseStart) / options.releaseTime);
    }
    else // end
    {
        return Color(options.releaseColor);
    }

}

exports.gamma = function(color, gamma)
{
    if (!gamma) gamma = { r: 2.2, g: 2.2, b: 2.2 };

    color = Color(color);
    color.red(Math.pow(color.red() / 256.0, gamma.r) * 255.0);
    color.green(Math.pow(color.green() / 256.0, gamma.g) * 255.0);
    color.blue(Math.pow(color.blue() / 256.0, gamma.b) * 255.0);

    return color;
}
