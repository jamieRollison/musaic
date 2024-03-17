import React, { useEffect, useRef } from "react"
import * as d3 from "d3"

/**
 * I just COULD NOT get the D3 pie graph to be responsive, so I gave up.
 */
// /**
//  * Code snippet from:
//  * https://brendansudol.github.io/writing/responsive-d3
//  */
// function responsivefy(svg) {
//   // get container + svg aspect ratio
//   var container = d3.select(svg.node().parentNode),
//       width = parseInt(svg.style("width")),
//       height = parseInt(svg.style("height")),
//       aspect = width / height;

//   // add viewBox and preserveAspectRatio properties,
//   // and call resize so that svg resizes on inital page load
//   svg.attr("viewBox", "0 0 " + width + " " + height)
//       .attr("perserveAspectRatio", "xMinYMid")
//       .call(resize);

//   // to register multiple listeners for same event type, 
//   // you need to add namespace, i.e., 'click.foo'
//   // necessary if you call invoke this function for multiple svgs
//   // api docs: https://github.com/mbostock/d3/wiki/Selections#on
//   d3.select(window).on("resize." + container.attr("id"), resize);

//   // get width of container and resize svg to fit it
//   function resize() {
//       var targetWidth = parseInt(container.style("width"));
//       svg.attr("width", targetWidth);
//       svg.attr("height", Math.round(targetWidth / aspect));
//   }
// }

function Dial() {
  const svgRef = useRef()
  const monthData = [
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
  ]
  // ].reduce((acc, m) => {
  //   acc.push({month: m, id: acc.length+1})
  //   return acc
  // }, [])

  // draw the dial
  useEffect(() => {
    const svg = d3.select(svgRef.current)
      .attr('width', 450)
      .attr('height', 450)
    const WIDTH = svg.attr('width')
    const HEIGHT = svg.attr('height')

    const PAD = {h: 10, v: 10}
    const P_WIDTH = WIDTH - 2*PAD.h
    const P_HEIGHT = HEIGHT - 2*PAD.v

    const LABEL_INNER_RADIUS = P_WIDTH/3
    const LABEL_OUTER_RADIUS = P_WIDTH/2
    const LABEL_MEDIAN_RADIUS = 
      LABEL_INNER_RADIUS + ((LABEL_OUTER_RADIUS - LABEL_INNER_RADIUS)/2)
    const LABEL_CENTERLINE_LENGTH = 2 * Math.PI * LABEL_MEDIAN_RADIUS
    const LABEL_MONTH_CENTERLINE_LENGTH = 
      LABEL_CENTERLINE_LENGTH / monthData.length
    const LABEL_RADIUS_SIZE = LABEL_OUTER_RADIUS - LABEL_INNER_RADIUS

    const pie = d3.pie().value(1)
    const arc = d3.arc()
      .innerRadius(LABEL_INNER_RADIUS)
      .outerRadius(LABEL_OUTER_RADIUS)
      .padAngle(0.035)

    /**
     * Base arc drawing + text code comes from:
     * https://www.visualcinnamon.com/2015/09/placing-text-on-arcs/
     */
    // Draw the arcs themselves
    svg.selectAll('.monthArc')
      .data(pie(monthData))
      .enter().append('path')
        .attr('class', 'monthArc')
        .attr('id', (d, i) => 'monthArc_'+i) // unique id for each slice
        .attr('d', arc)
        .attr('transform', `translate(${WIDTH/2}, ${HEIGHT/2})`)

    //Append the month names to each slice
    svg.selectAll(".monthText")
      .data(monthData)
      .enter().append("text")
      .attr("class", "monthText")
      .attr('x', LABEL_MONTH_CENTERLINE_LENGTH*0.20)
      .attr('dy', LABEL_RADIUS_SIZE*0.65)
      .append("textPath")
      .attr("xlink:href", (d,i) => "#monthArc_"+i)
      .text(d => d)
  }, [monthData])

  return (
      <svg ref={svgRef}></svg>
  )
}

export default Dial