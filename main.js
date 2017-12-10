import * as d3 from 'd3';
import { Vector } from './geometry';
import { System } from './springs';

let width = 1000;
let height = 600;
let svg = d3.select("body").insert("svg", ":first-child")
                           .attr("width", width)
                           .attr("height", height);

let originX = width / 2;
let originY = height / 2;

let arrowheadSize = 40;
let vectorColor = '#333';
let vectorStroke = 2;

let stringColor = '#ccc';
let stringWidth = 1;

let beadRadius = 10;
let beadColor = '#ccc';
let beadStroke = 2;
let beadStrokeColor = '#333';

function fromCartesianX(x) { return originX + x; }
function fromCartesianY(y) { return originY - y; }
function toCartesianX(x) { return x - originX; }
function toCartesianY(y) { return -y + originY; }


function createVectorsSVG(beads) {
  let vectorContainers = svg.selectAll(".forces").data(beads).enter().append('g');
  let vectors = vectorContainers
           .append('line')
           .attr("x1", function(d) { return fromCartesianX(d.position.x); })
           .attr("y1", function(d) { return fromCartesianY(d.position.y); })
           .attr("x2", function(d) { return fromCartesianX(d.displayForce().x); })
           .attr("y2", function(d) { return fromCartesianY(d.displayForce().y); });

  let triangleSymbol = d3.symbol().size(arrowheadSize).type(d3.symbolTriangle);
  let arrowheads = vectorContainers.append('g').append('path')
    .attr('d', triangleSymbol);

  arrowheads.attr('transform', function(d) {
      let offset = d.acceleration.arrowheadOffset();
      let displayForce = d.displayForce();
      let displayX = fromCartesianX(displayForce.x) + offset[0];
      let displayY = fromCartesianY(displayForce.y) + offset[1];
      let rotationFromVertical = offset[2];
      return ("translate(" + displayX + " " + displayY + ") " + "rotate(" + rotationFromVertical + ")");
    });
  return {vectors: vectors, arrowheads: arrowheads};
}

function vectorsStyle(vectorSVG) {
  vectorSVG.vectors
           .attr("stroke", vectorColor)
           .attr("stroke-width", vectorStroke);

  vectorSVG.arrowheads
           .style("fill", vectorColor);
}

function createStringsSVG(beads) {
  let beadPairs = [];
  for (let i = 0; i < beads.length - 1; i++) {
    beadPairs.push([beads[i], beads[i+1]]);
  }

  let stringContainers = svg.selectAll(".string")
    .data(beadPairs).enter().append('g');
  let strings = stringContainers.append('line');
  strings.attr("x1", function(d) { return fromCartesianX(d[0].position.x); })
         .attr("y1", function(d) { return fromCartesianY(d[0].position.y); })
         .attr("x2", function(d) { return fromCartesianX(d[1].position.x); })
         .attr("y2", function(d) { return fromCartesianY(d[1].position.y); });

  return strings;
}

function stringsStyle(stringsSVG) {
  stringsSVG.attr("stroke", stringColor)
            .attr("stroke-width", stringWidth);
}

function createBeadsSVG(beads) {
  let circleContainers = svg.selectAll(".point").data(beads).enter().append('g');
  let circles = circleContainers.append('circle');
  circles.attr("cx", function (d) { return fromCartesianX(d.position.x); })
         .attr("cy", function (d) { return fromCartesianY(d.position.y); })
         .attr("r", beadRadius)
         .attr("id", function(d) { return d.id; });

  return circles;
}

function beadsStyle(beadsSVG) {
  beadsSVG.attr("fill", beadColor)
          .attr("stroke", beadStrokeColor)
          .attr("stroke-width", beadStroke);
  return beadsSVG;
}

function createSystemSVG(system) {
  let beadsSVG = createBeadsSVG(system.beads);
  beadsStyle(beadsSVG);

  let vectorsSVG = createVectorsSVG(system.beads);
  vectorsStyle(vectorsSVG);

  let stringsSVG = createStringsSVG(system.beads);
  stringsStyle(stringsSVG);

  return {beads: beadsSVG, forces: vectorsSVG, strings: stringsSVG};
}

function updatePositions(systemSVG) {
  let { beads, forces, strings } = systemSVG;

  beads
    .attr("cx", function (d) { return fromCartesianX(d.position.x); })
    .attr("cy", function (d) { return fromCartesianY(d.position.y); });

  forces.vectors
    .attr("x1", function(d) { return fromCartesianX(d.position.x); })
    .attr("y1", function(d) { return fromCartesianY(d.position.y); })
    .attr("x2", function(d) { return fromCartesianX(d.displayForce().x); })
    .attr("y2", function(d) { return fromCartesianY(d.displayForce().y); });

  strings.attr("x1", function(d) { return fromCartesianX(d[0].position.x); })
         .attr("y1", function(d) { return fromCartesianY(d[0].position.y); })
         .attr("x2", function(d) { return fromCartesianX(d[1].position.x); })
         .attr("y2", function(d) { return fromCartesianY(d[1].position.y); });

  forces.arrowheads.attr('transform', function(d) {
    let offset = d.acceleration.arrowheadOffset();
    let displayForce = d.displayForce();
    let displayX = fromCartesianX(displayForce.x) + offset[0];
    let displayY = fromCartesianY(displayForce.y) + offset[1];
    let rotationFromVertical = offset[2];
    return ("translate(" + displayX + " " + displayY + ") " + "rotate(" + rotationFromVertical + ")");
  });
}

var system = new System(width, 5);
let bead = system.beads[2];
let initialDisplacements = [
  0,
  50,
  0,
  0,
  0
];

for (let i = 0; i < initialDisplacements.length; i++) {
  system.beads[i+1].position.y += initialDisplacements[i];
}

var systemSVG = createSystemSVG(system);

window.setInterval(function() {
  system.simulateStep();
  updatePositions(systemSVG);
}, 1000 / 40);
