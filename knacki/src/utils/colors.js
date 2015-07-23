'use strict';

module.exports = {
    randColor: function() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ )
        {
            color += letters[Math.round(Math.random() * 15)];
        }
        return color;
    },

    // Returns an array of rgb colors from start to
    // end width "steps" midpoints, maximum 255 steps
    createColorRange: function(start, end, steps) {
        var rgb;
        var hex;
        var colors = [];
        var amount = [];
        var last;
        var first;

        steps = Math.min(steps, 256);
        steps--;
        hex = /^#[0-9a-fA-F]{6}$/;
        rgb = /(^rgb\((\d+),\s*(\d+),\s*(\d+)\))$/;

        if(hex.test(start) && hex.test(end)) {
            start = this.hexToRgb(start);
            end = this.hexToRgb(end);
        }
        if(rgb.test(start) && rgb.test(end)) {
            last = end;
            first = start;
            colors.push(start);
            start = start.replace('rgb(', '').replace(')', '').split(',');
            end = end.replace('rgb(', '').replace(')', '').split(',');
        } else {
            console.log('This function takes RGB or HEX colors only.', start, end);
        }

        // processing colors
        for(var i = 0; i < 3; i++) {
            amount[i] = ~~((end[i] - start[i]) / steps);
        }

        var midpoint, red, green, blue;
        for(var j = 1; j < steps; j++) {
            red = ~~(start[0]) + ~~(amount[0])*j;
            green = ~~(start[1]) + ~~(amount[1])*j;
            blue = ~~(start[2]) + ~~(amount[2])*j;
            midpoint = 'rgb(' + red + ',' + green + ',' + blue + ')';
            colors.push(midpoint);
        }
        colors.push(last);
        return colors;
    },

    // Returns a random rgba color from an array of
    // rgb colors, generated on
    // http://meyerweb.com/eric/tools/color-blend/
    getColorInRange: function(toneArray, alpha) {
        var color;
        var colorIndex;
        var length;

        length = toneArray.length;
        colorIndex  = ~~(Math.random()*length);
        color = toneArray[colorIndex];
        color = color.replace('rgb', 'rgba');
        color = color.split(')') + alpha + ')';
        return color;
    },

    hexToRgb: function(hex)  {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        var r;
        var g;
        var b;

        r = parseInt(result[1], 16);
        g = parseInt(result[2], 16);
        b = parseInt(result[3], 16);

        return 'rgb(' + r + ',' + g + ',' + b + ')';
    }
};