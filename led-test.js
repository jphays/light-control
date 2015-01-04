var ArduinoFirmata = require('arduino-firmata');

var arduino = new ArduinoFirmata();

var LEDS = 15;
var FPS = 25;

var leds = [];
var loopInterval;

init();

// Initialization

function init()
{
    console.log("initializing...");

    initCallbacks();
    initArrays();
    initRotate();

    console.log("connecting...");
    arduino.connect();
}

function loop()
{
    rotateLeds();
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
        console.log("connected: " + arduino.boardVersion);
        loopInterval = setInterval(loop, 1000 / FPS);
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
    for (var i = 0; i < LEDS; i++)
    {
        leds[i] = [];
        for (var c = 0; c < 3; c++)
        {
            leds[i][c] = 0;
        }
    }
}

// Test pattern

function initRotate()
{
    for (var i = 0; i < LEDS; i++)
    {
        leds[i][0] = i % 128;
        leds[i][1] = (i + 30) % 128;
        leds[i][2] = (i + 60) % 128;
    }
}

function rotateLeds()
{
    for (var i = 0; i < LEDS; i++)
    {
        for (var c = 0; c < 3; c++)
        {
            leds[i][c] = leds[i][c] + 1 % 128;
        }
    }
}

// Send colors

function sendColors()
{
    var ledStrand = getStrand();
    arduino.sysex(0x01, ledStrand, function()
    {
        // console.log("sent frame.");
    });
}

function getStrand()
{
    var ledStrand = [];
    for (var i = 0; i < leds.length; i++)
    {
        for (var c = 0; c < 3; c++)
        {
            ledStrand.push(leds[i][c]);
        }
    }
    return ledStrand;
}
