var _ = require('lodash');
var Color = require('color');

// 7-color rainbow
var rainbow = [
    Color({ h: 0,   s: 100, v: 85 }), // red
    Color({ h: 12,  s: 100, v: 85 }), // orange
    Color({ h: 45,  s: 100, v: 85 }), // yellow
    Color({ h: 120, s: 100, v: 85 }), // green
    Color({ h: 150, s: 100, v: 85 }), // teal
    Color({ h: 240, s: 100, v: 85 }), // blue
    Color({ h: 255, s: 100, v: 85 }) // purple
];

// rainbow with black and white
var rainbowBW = [
    Color({ h: 0,   s: 0,   v: 0  }), // black
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
var oldRainbow = [
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

function schemeFromDegrees(color, degrees)
{
    var scheme = [];
    for (var i = 0; i < degrees.length; i++)
    {
        var c = Color(color).clone();
        c.hue((c.hue() + degrees[i]) % 360);
        scheme.push(c);
    }
    return scheme;
}

function complementaryScheme(color)
{
    return schemeFromDegrees(color, [0,180]);
}

function splitComplementaryScheme(color)
{
    return schemeFromDegrees(color, [0,150,320]);
}

function splitComplementaryCWScheme(color)
{
    return schemeFromDegrees(color, [0,150,300]);
}

function splitComplementaryCCWScheme(color)
{
    return schemeFromDegrees(color, [0,60,210]);
}

function triadicScheme(color)
{
    return schemeFromDegrees(color, [0,120,240]);
}

function clashScheme(color)
{
    return schemeFromDegrees(color, [0,90,270]);
}

function tetradicScheme(color)
{
    return schemeFromDegrees(color, [0,90,180,270]);
}

function fourToneCWScheme(color)
{
    return schemeFromDegrees(color, [0,60,180,240]);
}

function fourToneCCWScheme(color)
{
    return schemeFromDegrees(color, [0,120,180,300]);
}

function fiveToneAScheme(color)
{
    return schemeFromDegrees(color, [0,115,155,205,245]);
}

function fiveToneBScheme(color)
{
    return schemeFromDegrees(color, [0,40,90,130,245]);
}

function fiveToneCScheme(color)
{
    return schemeFromDegrees(color, [0,50,90,205,320]);
}

function fiveToneDScheme(color)
{
    return schemeFromDegrees(color, [0,40,155,270,310]);
}

function fiveToneEScheme(color)
{
    return schemeFromDegrees(color, [0,115,230,270,320]);
}

function sixToneCWScheme(color)
{
    return schemeFromDegrees(color, [0,30,120,150,240,270]);
}

function sixToneCCWScheme(color)
{
    return schemeFromDegrees(color, [0,90,120,210,240,330]);
}

function neutralScheme(color)
{
    return schemeFromDegrees(color, [0,15,30,45,60,75]);
}

function analogousScheme(color)
{
    return schemeFromDegrees(color, [0,30,60,90,120,150]);
}

var allGenerators = [ complementaryScheme,
                      splitComplementaryScheme,
                      splitComplementaryCWScheme,
                      splitComplementaryCCWScheme,
                      triadicScheme,
                      clashScheme,
                      tetradicScheme,
                      fourToneCWScheme,
                      fourToneCCWScheme,
                      fiveToneAScheme,
                      fiveToneBScheme,
                      fiveToneCScheme,
                      fiveToneDScheme,
                      fiveToneEScheme,
                      sixToneCWScheme,
                      sixToneCCWScheme,
                      neutralScheme,
                      analogousScheme ];

function randomPalette()
{
    var scheme = _.sample(allGenerators);
    var hue = _.random(360);

    console.log("generated palette: " + scheme.name + " / " + hue + "");

    return scheme({ h: _.random(360), s: 100, v: 80 });
}

module.exports = exports =
{
    rainbow: rainbow,
    rainbowBW: rainbowBW,
    oldRainbow: oldRainbow,

    schemeFromDegrees: schemeFromDegrees,
    complementaryScheme: complementaryScheme,
    splitComplementaryScheme: splitComplementaryScheme,
    splitComplementaryCWScheme: splitComplementaryCWScheme,
    splitComplementaryCCWScheme: splitComplementaryCCWScheme,
    triadicScheme: triadicScheme,
    clashScheme: clashScheme,
    tetradicScheme: tetradicScheme,
    fourToneCWScheme: fourToneCWScheme,
    fourToneCCWScheme: fourToneCCWScheme,
    fiveToneAScheme: fiveToneAScheme,
    fiveToneBScheme: fiveToneBScheme,
    fiveToneCScheme: fiveToneCScheme,
    fiveToneDScheme: fiveToneDScheme,
    fiveToneEScheme: fiveToneEScheme,
    sixToneCWScheme: sixToneCWScheme,
    sixToneCCWScheme: sixToneCCWScheme,
    neutralScheme: neutralScheme,
    analogousScheme: analogousScheme,

    randomPalette: randomPalette
};
