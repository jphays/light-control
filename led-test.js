var ArduinoFirmata = require('arduino-firmata');
var Color = require('color');

var scenes = require('./scenes');

var options =
{
    ledCount: 50,
    fps: 25
};

var arduino = new ArduinoFirmata();
var leds = [];
var loopInterval;
var scene;

init();

// Initialization

function init()
{
    console.log("initializing...");

    initCallbacks();
    initArrays();

    scene = scenes.rainbow;
    scene.init(options);

    console.log("connecting...");
    arduino.connect();
}

function loop()
{
    leds = scene.render();
    sendColors();
}

function initCallbacks()
{

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

    // arduino connection
    arduino.on('connect', function()
    {
        console.log("connected: " + arduino.boardVersion + " (" + arduino.serialport_name + ")");
        loopInterval = setInterval(loop, 1000 / options.fps);
    });

    // sysex callback
    arduino.on('sysex', function(e)
    {
        console.log("sysex received.");
        console.log("command : " + e.command);
        console.log("data    : " + JSON.stringify(e.data));
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

function getStrand()
{
    var ledStrand = [];
    for (var i = 0; i < leds.length; i++)
    {
        var colorRgb = leds[i].rgb();
        ledStrand.push(colorRgb.r);
        ledStrand.push(colorRgb.g);
        ledStrand.push(colorRgb.b);
    }
    return ledStrand;
}

function sendColors()
{
    var ledStrand = getStrand();
    arduino.sysex(0x01, ledStrand, function()
    {
        // console.log("sent frame.");
    });
}