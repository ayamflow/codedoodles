'use strict';

var Ball = require('./entities/ball');
var raf = require('component-raf');
var Colors = require('./utils/colors');
var Math2 = require('./utils/math');

var colors = [
    {
        start: '#e01b6a',
        end: '#fcde00'
    }, {
        start: '#e01bb1',
        end: '#4a00fc'
    }, {
        start: '#c2ff00',
        end: '#faa100'
    }
];

var scaleFactor = 0.75;

module.exports = Playground;
function Playground(density, size) {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.points = [];
    this.density = density;
    this.createSize = size;
    this.mx = 0;
    this.my = 0;

    var col = Math2.randValueFromArray(colors);
    this.startColor = col.start;
    this.endColor = col.end;
    this.aura = Math.random() > 0.5;
    this.step = 170;
    this.auraRatio = 3;
    this.backgroundColor = '#111111';

    this.colors = Colors.createColorRange(this.startColor, this.endColor, 10);

    for(var i = 0; i < this.density; i++) {
        this.points[i] = new Ball(
            Math.random() * this.width,
            Math.random() * this.height,
            (Math.random() * 6) -3,
            (Math.random() * 6) -3,
            ~~(Math.random() * size) + size,
            Colors.getColorInRange(this.colors, 1),
            Colors.getColorInRange(this.colors, 0)
        );
    }

    this.hidden = this.createHiddenCanvas(this.width, this.height);
    this.canvas = document.querySelector('#canvas');
    this.context = this.canvas.getContext('2d');

    this.animate = this.animate.bind(this);
    this.resize = this.resize.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onMove = this.onMove.bind(this);

    window.addEventListener('resize', this.resize);
    window.addEventListener('click', this.onClick);
    window.addEventListener('mousemove', this.onMove);

    this.resize();
    this.animate();
}

Playground.prototype.animate = function() {
    var friction = Ball.prototype.friction;
    var distance = Ball.prototype.distance;
    var w = this.width;
    var h = this.height;
    var hidden = this.hidden;
    var context = this.context;

    this.hidden.clearRect(0, 0, w, h);

    for(var i = 0; i < this.density; i++) {
        var p = this.points[i];

        // Dist to mouse
        var dx = this.mx - p.x;
        var dy = this.my - p.y;
        var mouseDistance = dx * dx + dy * dy;

        // Repulsion
        if(mouseDistance < distance * distance) {
            p.ax += 0.03;
            p.ay += Math.random() * 0.07 + 0.03;
            var dx = this.mx + Math.cos(p.ax) * distance + p.vx;
            var dy = this.my + Math.sin(p.ay) * distance + p.vy;
            p.x += (dx - p.x) * friction * p.vx;
            p.y += (dy - p.y) * friction * p.vy;
        }

        p.update();
        this.draw(hidden, p);
        p.wrap(0, 0, w, h);
    }

    this.threshold(hidden, context);
    this.drawCircle(context);

    raf(this.animate);
}

Playground.prototype.threshold = function(hiddenContext, displayedContext) {
    var imageData = hiddenContext.getImageData(0, 0, this.width, this.height);
    var imgData = imageData.data;

    for (var i = 0, l = imgData.length; i < l; i+= 4) {
        if(imgData[i+3] < this.step) {
            if(this.aura) imgData[i+3] = imgData[i+3] / this.auraRatio;
            else imgData[i+3] = 0;
        }
    }

    displayedContext.putImageData(imageData, 0, 0);
};

Playground.prototype.draw = function(context, point) {
    var gradient = context.createRadialGradient(point.x, point.y, 1, point.x, point.y, point.size);

    context.beginPath();

    gradient.addColorStop(0, point.startColor); // center color
    gradient.addColorStop(1, point.endColor); // border color

    context.fillStyle = gradient;
    context.strokeStyle = gradient;
    context.arc(point.x, point.y, point.size, 0, Math.PI*2);
    context.fill();
};

Playground.prototype.drawCircle = function(context) {
    context.beginPath();
    context.fillStyle = 'rgba(255, 255, 255, 0.03)';
    context.arc(this.mx, this.my, Ball.prototype.distance * scaleFactor, 0, Math.PI * 2); // repulsion circle
    context.fill();
};

Playground.prototype.createHiddenCanvas = function(width, height) {
    var canvas = document.createElement('canvas');
    canvas.width = width * scaleFactor;
    canvas.height = height * scaleFactor;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    return canvas.getContext('2d');
};

Playground.prototype.onClick = function(e) {
    this.points.push(new Ball(
        e.clientX * scaleFactor,
        e.clientY * scaleFactor,
        (Math.random() * 8) -4,
        (Math.random() * 8) -4,
        ~~(Math.random() * this.createSize) + this.createSize,
        Colors.getColorInRange(this.colors, 1),
        Colors.getColorInRange(this.colors, 0))
    );
    this.density++;
};

Playground.prototype.onMove = function(e) {
    this.mx = e.clientX * scaleFactor;
    this.my = e.clientY * scaleFactor;
};

Playground.prototype.resize = function() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * scaleFactor;
    this.canvas.height = this.height * scaleFactor;
    this.canvas.style.width = this.width + 'px';
    this.canvas.style.height = this.height + 'px';
};