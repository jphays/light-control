var scenes = [
    'cycle',
    'rainbow'
];

scenes.forEach(function(path) {
    var scene = require('./' + path);
    exports[path] = scene;
});

// list of all scene names
exports.scenes = scenes;