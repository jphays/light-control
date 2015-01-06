var scenes = ['rainbow'];

scenes.forEach(function(path) {
    var scene = require('./' + path);
    exports[path] = scene;
});