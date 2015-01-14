var Color = require('color');

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

// rainbow with black and white
exports.rainbowBW = [
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

// 7-color rainbow
exports.rainbow = [
    Color({ h: 0, s: 100, v: 85 }), // red
    Color({ h: 12, s: 100, v: 85 }), // orange
    Color({ h: 45, s: 100, v: 85 }), // yellow
    Color({ h: 120, s: 100, v: 85 }), // green
    Color({ h: 150, s: 100, v: 85 }), // teal
    Color({ h: 240, s: 100, v: 85 }), // blue
    Color({ h: 255, s: 100, v: 85 }) // purple
];