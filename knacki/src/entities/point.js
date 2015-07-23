'use strict';

module.exports = Point;
function Point(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
}

Point.prototype.update = function() {
    this.x += this.vx;
    this.y += this.vy;
};

Point.prototype.wrap = function(x, y, width, height) {
    if(this.x >= width || this.x <= x) this.vx = -this.vx;
    if(this.y >= height || this.y <= y) this.vy = -this.vy;
};