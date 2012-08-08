/*
 * NASA Canvas Module Example and Usage
 * 
 * This example shows creating basic shapes like a square and 
 * rectangle. You can also do things like state changes.
 *
 * Copyright 2012 Nijiko Yonskai (@vizualover)
 */
var canvas = nasa.canvas({
  width: 250,
  height: 250
});

$('body').append(canvas.create());

// Clear Canvas
canvas.clear();

// Create Rectangle with black border
canvas.setStyles({
  stroke: {
    width: 2,
    color: "#000000"
  }
}).rect({
  stroke: [ 100, 100, 50, 50 ] 
});

// Create a filled circle
canvas.setStyles({
  fill: {
    color: "#000000"
  }
}).startPath().defineSegments([
  { arc: [ 20, 20, 10, 0, Math.PI * 2, true ] }
]).endPath({
  close: true,
  fill: true
});​