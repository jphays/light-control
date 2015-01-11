var ArduinoFirmata = require('arduino-firmata');
var Color = require('color');
var _ = require('lodash');

var scenes = require('./scenes');

var SYSEX_SET_COLORS = 0x01;

var options =
{
    ledCount: 50,
    fps: 30
};

var state =
{
    time: 0,
    frame: 0
};

var arduino = new ArduinoFirmata();
var loopInterval;
var leds = [];
var scene;

init();

// Initialization

function init()
{
    console.log("initializing...");

    initCallbacks();
    initArrays();

    scene = _.sample(scenes.all);

    console.log("connecting...");
    arduino.connect();
}

function loop()
{
    state.time = Date.now();
    state.frame++;

    leds = scene.render(state);
    sendColors(leds);
}

function initCallbacks()
{

    // arduino connection
    arduino.on('connect', function()
    {
        console.log("connected: " + arduino.boardVersion + " (" + arduino.serialport_name + ")");
        scene.init(options);
        loopInterval = setInterval(loop, 1000 / options.fps);
    });

    // sysex callback
    arduino.on('sysex', function(e)
    {
        console.log("sysex received.");
        console.log("command : " + e.command);
        console.log("data    : " + JSON.stringify(e.data));
    });

    // handle ctrl+c gracefully
    process.on('SIGINT', function()
    {
        console.log("caught interrupt signal.");
        arduino.close(function() {
            console.log("connection closed.");
            clearInterval(loopInterval);
            process.exit();
        });
    });

}

function initArrays()
{
    for (var i = 0; i < options.ledCount; i++)
    {
        leds[i] = Color({ r: 0, g: 0, b: 0 });
    }
}

// Send colors

function getBytes(strand)
{
    var ledStrand = [];
    for (var i = 0; i < strand.length; i++)
    {
        var colorRgb = leds[i].rgb();
        ledStrand.push(colorRgb.r, colorRgb.g, colorRgb.b);
    }
    return ledStrand;
}

function sendColors(strand)
{
    var bytes = getBytes(strand);
    arduino.sysex(SYSEX_SET_COLORS, bytes, function()
    {
        // console.log("sent frame.");
    });
}