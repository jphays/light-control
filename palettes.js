var Color = require('color');

// 7-color rainbow
exports.rainbow = [
    Color({ h: 0,   s: 100, v: 85 }), // red
    Color({ h: 12,  s: 100, v: 85 }), // orange
    Color({ h: 45,  s: 100, v: 85 }), // yellow
    Color({ h: 120, s: 100, v: 85 }), // green
    Color({ h: 150, s: 100, v: 85 }), // teal
    Color({ h: 240, s: 100, v: 85 }), // blue
    Color({ h: 255, s: 100, v: 85 }) // purple
];

// rainbow with black and white
exports.rainbowBW = [
    Color({ h: 0,   s: 0,   v: 0}), // black
    Color({ h: 0,   s: 100, v: 85 }), // red
    Color({ h: 12,  s: 100, v: 85 }), // orange
    Color({ h: 45,  s: 100, v: 85 }), // yellow
    Color({ h: 120, s: 100, v: 85 }), // green
    Color({ h: 150, s: 100, v: 85 }), // teal
    Color({ h: 240, s: 100, v: 85 }), // blue
    Color({ h: 255, s: 100, v: 85 }), // purple
    Color({ h: 120, s: 8,   v: 85 })  // white
];

// original rainbow palette
exports.oldRainbow = [
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

// color scheme generation functions
// from https://github.com/brehaut/color-js

exports.schemeFromDegrees = function(color, degrees)
{
    var scheme = [];
    for (var i = 0; i < degrees.length; i++)
    {
        var c = Color(color).clone();
        c.hue((c.hue() + degrees[i]) % 360);
        scheme.push(c);
    }
    return scheme;
};

exports.complementaryScheme = function(color)
{
    return this.schemeFromDegrees(color, [0,180]);
};

exports.splitComplementaryScheme = function(color)
{
    return this.schemeFromDegrees(color, [0,150,320]);
};

exports.splitComplementaryCWScheme = function(color)
{
    return this.schemeFromDegrees(color, [0,150,300]);
};

exports.splitComplementaryCCWScheme = function(color)
{
    return this.schemeFromDegrees(color, [0,60,210]);
};

exports.triadicScheme = function(color)
{
    return this.schemeFromDegrees(color, [0,120,240]);
};

exports.clashScheme = function(color)
{
    return this.schemeFromDegrees(color, [0,90,270]);
};

exports.tetradicScheme = function(color)
{
    return this.schemeFromDegrees(color, [0,90,180,270]);
};

exports.fourToneCWScheme = function(color)
{
    return this.schemeFromDegrees(color, [0,60,180,240]);
};

exports.fourToneCCWScheme = function(color)
{
    return this.schemeFromDegrees(color, [0,120,180,300]);
};

exports.fiveToneAScheme = function(color)
{
    return this.schemeFromDegrees(color, [0,115,155,205,245]);
};

exports.fiveToneBScheme = function(color)
{
    return this.schemeFromDegrees(color, [0,40,90,130,245]);
};

exports.fiveToneCScheme = function(color)
{
    return this.schemeFromDegrees(color, [0,50,90,205,320]);
};

exports.fiveToneDScheme = function(color)
{
    return this.schemeFromDegrees(color, [0,40,155,270,310]);
};

exports.fiveToneEScheme = function(color)
{
    return this.schemeFromDegrees(color, [0,115,230,270,320]);
};

exports.sixToneCWScheme = function(color)
{
    return this.schemeFromDegrees(color, [0,30,120,150,240,270]);
};

exports.sixToneCCWScheme = function(color)
{
    return this.schemeFromDegrees(color, [0,90,120,210,240,330]);
};

exports.neutralScheme = function(color)
{
    return this.schemeFromDegrees(color, [0,15,30,45,60,75]);
};

exports.analogousScheme = function(color)
{
    return this.schemeFromDegrees(color, [0,30,60,90,120,150]);
};