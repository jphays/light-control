var _ = require('lodash');
var ArduinoFirmata = require('arduino-firmata');
var Color = require('color');

var scenes = require('./scenes');
var transitions = require('./transitions');
var palettes = require('./palettes');

var SYSEX_SET_COLORS = 0x01;

var options =
{
    ledCount: 50,
    fps: 48,
    debug: false,
    sceneLength: 15,   // seconds
    transitionTime: 3, // seconds
    palette: null,
    randomizePalette: true
};

var state =
{
    time: 0,
    frame: 0,
    leds: [],
    scene: _.sample(scenes.all),
    nextScene: null,
    lastTransitionTime: 0,
    transition: null,
    loopInterval: null
};

var arduino = new ArduinoFirmata();

init();

// initialization

function init()
{
    console.log("  _ _      _   _                _           _ ");
    console.log(" | (_)__ _| |_| |_   __ ___ _ _| |_ _ _ ___| |");
    console.log(" | | / _` | ' \\  _|_/ _/ _ \\ ' \\  _| '_/ _ \\ |");
    console.log(" |_|_\\__, |_||_\\__(_)__\\___/_||_\\__|_| \\___/_|");
    console.log("     |___/                                    ");
    console.log("_______________________________________________")
    console.log("");
    console.log("leds: " + options.ledCount + " | " + options.fps + " fps");

    initCallbacks();

    console.log("connecting...");
    arduino.connect();
}

function initCallbacks()
{

    // arduino connection
    arduino.on('connect', function()
    {
        console.log("connected: " + arduino.boardVersion + " (" + arduino.serialport_name + ")");

        // init scene
        console.log("scene: " + state.scene.name);
        state.scene.init(options);
        state.lastTransitionTime = Date.now();

        // start main loop
        state.loopInterval = setInterval(loop, 1000 / options.fps);
    });

    // sysex callback
    arduino.on('sysex', function(e)
    {
        if (options.debug)
        {
            console.log("sysex received.");
            console.log("command : " + e.command);
            console.log("data    : " + JSON.stringify(e.data));
        }
    });

    // handle ctrl+c gracefully
    process.on('SIGINT', function()
    {
        console.log("interrupt acknowledged.");
        arduino.close(function() {
            console.log("connection closed.");
            clearInterval(state.loopInterval);
            process.exit();
        });
    });

}

// main loop

function loop()
{
    state.time = Date.now();
    state.frame++;

    state.leds = generateFrame();
    sendColors(state.leds);
}

function generateFrame()
{
    if (state.time > state.lastTransitionTime + (options.sceneLength * 1000))
    {
        // transition begins

        state.lastTransitionTime = state.time;
        state.transition = _.sample(transitions.all);
        state.nextScene = _.sample(_.filter(scenes.all, function(scene) { return scene.name != state.scene.name }));

        console.log("transition (" + state.transition.name + "): " + state.scene.name + " -> " + state.nextScene.name);

        if (options.randomizePalette) options.palette = palettes.randomPalette();
        state.nextScene.init(options);
    }
    else if (state.time < state.lastTransitionTime + (options.transitionTime * 1000) && state.nextScene)
    {
        // transition underway

        var position = (state.time - state.lastTransitionTime) / (options.transitionTime * 1000);
        return state.transition(state.scene.render(state),
                                state.nextScene.render(state),
                                position, options);
    }
    else if (state.nextScene)
    {
        // transition ends

        state.scene = state.nextScene;
        state.nextScene = null;

        console.log("transition complete: " + state.scene.name);
    }

    return state.scene.render(state);
}

// debug

function debugLed() {
    return (
        (state.frame % 10 === 0) ?
            new Color("white") :
        (state.frame % 5 === 0) ?
            new Color("blue") :
        // (state.frame % 2 === 0) ?
        //     new Color("red") :
            new Color("black"));
}

// send colors

function getBytes(strand)
{
    var bytes = [];
    for (var i = 0; i < strand.length; i++)
    {
        var colorRgb = strand[i].rgb();
        bytes.push(colorRgb.r, colorRgb.g, colorRgb.b);
    }

    if (options.debug)
    {
        var d = debugLed().rgb();
        bytes.splice(-3, 3, d.r, d.g, d.b);
    }

    return bytes;
}

function sendColors(strand)
{
    var bytes = getBytes(strand);
    arduino.sysex(SYSEX_SET_COLORS, bytes, function()
    {
        if (options.debug && state.frame % 10 == 0)
        {
            console.log(state.frame + " | " + strand[0].hslString());
        }
    });
}
