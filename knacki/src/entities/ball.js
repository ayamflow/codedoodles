'use strict';

var Point = require('./point');

module.exports = Ball;
function Ball(x, y, vx, vy, size, startColor, endColor) {
    Point.call(this, x, y, vx, vy);
    this.size = size;
    this.startColor = startColor;
    this.endColor = endColor;
    this.ax = Math.random() * Math.PI;
    this.ay = Math.random() * Math.PI;
}

Ball.prototype = Object.create(Point.prototype);
Ball.prototype.constructor = Ball;

Ball.prototype.friction = 0.02;
Ball.prototype.distance = 100;