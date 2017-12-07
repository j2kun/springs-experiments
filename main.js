import * as d3 from 'd3';
import { Vector, innerProduct } from './geometry';

let width = 800;
let height = 600;
let svg = d3.select("body").insert("svg", ":first-child")
                           .attr("width", width)
                           .attr("height", height);

let originX = width / 2;
let originY = height / 2;
let arrowheadSize = 125;
let vectorStroke = 4;

function fromCartesianX(x) { return originX + x; }
function fromCartesianY(y) { return originY - y; }
function toCartesianX(x) { return x - originX; }
function toCartesianY(y) { return -y + originY; }


function vectorStyle(vectorSVG, id, color) {
  vectorSVG.attr("x1", function(d) { return fromCartesianX(0); })
           .attr("y1", function(d) { return fromCartesianY(0); })
           .attr("x2", function(d) { return fromCartesianX(d.x); })
           .attr("y2", function(d) { return fromCartesianY(d.y); })
           .attr("id", id)
           .attr("stroke", color)
           .attr("stroke-width", vectorStroke);
  return vectorSVG;
}

function arrowheadStyle(arrowheadSVG, color) {
  let triangleSymbol = d3.symbol().size(arrowheadSize).type(d3.symbolTriangle);
  arrowheadSVG.style("fill", color)
              .style("cursor", "pointer")
              .attr('d', triangleSymbol);
  return arrowheadSVG;
}


function setupBehavior() {

  function setSpanningPosition(svg) {
    svg.attr("x1", function(d) { return fromCartesianX(d.spanningX1(width, height)); })
       .attr("x2", function(d) { return fromCartesianX(d.spanningX2(width, height)); })
       .attr("y1", function(d) { return fromCartesianY(d.spanningY1(width, height)); })
       .attr("y2", function(d) { return fromCartesianY(d.spanningY2(width, height)); });
  }

  function setArrowheadPosition(svg) {
    svg.attr('transform', function(d) {
      let offset = d.arrowheadOffset();
      let displayX = fromCartesianX(d.x) + offset[0];
      let displayY = fromCartesianY(d.y) + offset[1];
      let rotationFromVertical = offset[2];
      return ("translate(" + displayX + " " + displayY + ") " + "rotate(" + rotationFromVertical + ")");
    });
  }

  setPosition(vector, 'vector');
  setArrowheadPosition(vectorArrowhead);
}

setupBehavior();
