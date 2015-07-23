'use strict';

module.exports = {
    dist: function(x1, y1, x2, y2, fast) {
        var dist = ((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
        return fast ? dist : Math.sqrt(dist);
    },

    rand: function(min, max) {
        return Math.random() * (max - min) + min;
    },

    randValueFromArray: function(array) {
        var l = array.length;
        var index;
        index = ~~(Math.random() * l);
        return array[index];
    }
};