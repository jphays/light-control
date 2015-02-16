var scenes = [
    'cycle',
    'flash',
    'rainbow'
];

scenes.forEach(function(path) {
    var scene = require('./' + path);
    scene.name = path;
    exports[path] = scene;
});

// list of all scenes
exports.all = scenes.map(function(name) { return exports[name]; });