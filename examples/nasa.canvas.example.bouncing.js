/*
 * NASA Canvas Module Example and Usage
 * 
 * Bouncing Circle, Basic stuff!
 *
 * Copyright 2012 Nijiko Yonskai (@vizualover)
 */
var $body = $('.cnv')
,   w = $body.width()
,   h = $body.height()
,   x = 100
,   y = 100
,   dx = 2
,   dy = 4
,   d = 10
,   boost = 2
,   iid;

var canvas = nasa.canvas({
  width: w,
  height: h
});

function init() {
  $body.append(canvas.create());
  iid = setInterval(draw, d);
}

canvas.circle = function (x, y, d) {
  this.startPath().defineSegments([
    { arc: [ x, y, d, 0, Math.PI*2, true ] }
  ]).endPath({ close: 1, fill: 1 });
}

function draw() {
  canvas.clear().circle(x, y, 10);
  if (x + dx + d > w || x + dx - d < 0) dx = -dx;
  if (y + dy + d > h || y + dy - d < 0) dy = -dy;
  x += dx * boost;
  y += dy * boost;
}

init();