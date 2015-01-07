var scenes = [
    'cycle',
    'rainbow'
];

scenes.forEach(function(path) {
    var scene = require('./' + path);
    exports[path] = scene;
});

// list of all scenes
exports.all = scenes.map(function(name) { return exports[name]; });