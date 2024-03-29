import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import * as d3 from "d3"
import PropTypes from 'prop-types'
import { colors } from "../../routes/Visualization/offline"

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



function Dial({data, changeMonth, lens}) {
  const svgRef = useRef()
  const monthMap = useMemo(() =>{return {
    'JAN':1, 'FEB':2, 'MAR':3, 'APR':4, 'MAY':5, 'JUN':6,
    'JUL':7, 'AUG':8, 'SEP':9, 'OCT':10, 'NOV':11, 'DEC':12
  }}, [])
  const reverseMonthMap = useMemo(() => {
    return {0: 'Full Year', 1:'January', 2:'February', 3:'March', 4:'April', 5:'May', 6:'June', 7:'July', 8:'August', 9: 'September', 10: 'October', 11: 'November', 12: 'December'}
  }, [])

  const [currentMonth, setCurrentMonth] = useState(0)
  const months = Object.keys(monthMap)
  const total = data.reduce((acc, month) => {
    acc.valence += month.valence
    acc.energy += month.energy
    acc.danceability += month.danceability
    return acc
  }, {valence: 0, energy: 0, danceability: 0})


  const getMoods = useCallback(() => currentMonth !== 0 ? 
  [`Valence: ${data[currentMonth-1].valence.toFixed(2)}`, `Energy: ${data[currentMonth-1].energy.toFixed(2)}`, `Danceability: ${data[currentMonth-1].danceability.toFixed(2)}`] :
  [`Valence: ${(total.valence / 12).toFixed(2)}`, `Energy: ${(total.energy / 12).toFixed(2)}`, `Danceability: ${(total.danceability / 12).toFixed(2)}`], [currentMonth, data, total])

  // ].reduce((acc, m) => {
  //   acc.push({month: m, id: acc.length+1})
  //   return acc
  // }, [])

  // draw the dial
  useEffect(() => {
    const svg = d3.select(svgRef.current)
      .attr('width', 450)
      .attr('height', 450)

    // TODO: Query and get dict of Mood -> Color 
    // const moodMap = {
    //   'Joyful': '#ffff00',
    //   'Mysterious': '#c71585',
    //   'Lmao': '#008000'
    // }
    // const colors = Object.values(moodMap)
    // const moods = Object.keys(moodMap)
    const colorScale = d3.scaleQuantize().
      domain([0, 1]).
      range(colors)

    // CONSTANTS GALORE
    const WIDTH = svg.attr('width')
    const HEIGHT = svg.attr('height')

    const PAD = {h: 20, v: 20}
    const P_WIDTH = WIDTH - 2*PAD.h
    const P_HEIGHT = HEIGHT - 2*PAD.v

    const LABEL_INNER_RADIUS = Math.min(P_WIDTH, P_HEIGHT)/3
    const LABEL_OUTER_RADIUS = Math.min(P_WIDTH, P_HEIGHT)/2
    const LABEL_MEDIAN_RADIUS = 
      LABEL_INNER_RADIUS + ((LABEL_OUTER_RADIUS - LABEL_INNER_RADIUS)/2)
    const LABEL_CENTERLINE_LENGTH = 2 * Math.PI * LABEL_MEDIAN_RADIUS
    const LABEL_MONTH_CENTERLINE_LENGTH = 
      LABEL_CENTERLINE_LENGTH / months.length
    const LABEL_RADIUS_SIZE = LABEL_OUTER_RADIUS - LABEL_INNER_RADIUS
    const LABEL_PADDING = 0.035
    const LABEL_CORNER_RADIUS = 10

    const MOODS_LINE_PADDING = 75;
    const MOOD_SPACER = 
      (2*LABEL_INNER_RADIUS - 2*MOODS_LINE_PADDING)/(4)
    const MOODS_Y_STARTER = HEIGHT/2 - LABEL_INNER_RADIUS + MOODS_LINE_PADDING
    const MOODS_FONT_SIZE = 20 // px



    const pie = d3.pie().value(1)
    const arc = d3.arc()
      .innerRadius(LABEL_INNER_RADIUS)
      .outerRadius(LABEL_OUTER_RADIUS)
      .padAngle(LABEL_PADDING)
      .cornerRadius(LABEL_CORNER_RADIUS)

    // Ordering
    svg.append('g').attr('id', 'base')
    svg.append('g').attr('id', 'blend')
    svg.append('g').attr('id', 'moods')

    /**
     * Gradient coloring for the base circle, code from:
     * https://stackoverflow.com/questions/39023154/how-to-make-a-color-gradient-bar-using-d3js
     */
    // const colors = ['#c71585', '#ffff00']
    // const linearGradient = svg.append("defs").append("linearGradient")
    //     .attr("id", "linear-gradient")
    //     .attr("x1", "0%")
    //     .attr("y1", "0%")
    //     .attr("x2", "0%")
    //     .attr("y2", "100%");
    // linearGradient.selectAll('stop')
    //     .data(colors)
    //     .enter().append('stop')
    //       .style('stop-color', function(d){ return d; })
    //       .attr('offset', function(d,i){
    //         return 100 * (i / (colors.length - 1)) + '%';
    //     })

    // Draw the base circle
    // svg.select('#base').append('circle')
    //   .attr('transform', `translate(${WIDTH/2}, ${HEIGHT/2})`)
    //   .attr('r', 2 + Math.min(P_WIDTH, P_HEIGHT)/2)
    //   .style('fill', 'url(#linear-gradient)')

    /**
     * Base arc drawing + text code comes from:
     * https://www.visualcinnamon.com/2015/09/placing-text-on-arcs/
     */
    // Draw the arcs themselves
    svg.select("#blend").selectAll('.monthArc')
      .data(pie(months))
      .join('path')
        .attr('class', 'monthArc')
        .attr('id', (d, i) => 'monthArc_'+i) // unique id for each slice
        .attr('d', arc)
        .attr('transform', `translate(${WIDTH/2}, ${HEIGHT/2})`)
        .style('fill', (d, i) => colorScale(data[i][lens]))

    // Append the month names to each slice
    svg.select("#blend").selectAll(".monthText")
      .data(months)
      .enter().append("text")
        .attr("class", "monthText")
        .attr('x', LABEL_MONTH_CENTERLINE_LENGTH*0.30)
        .attr('dy', LABEL_RADIUS_SIZE*0.60)
        .append("textPath")
        .attr("xlink:href", (d,i) => "#monthArc_"+i)
        .text(d => d)
        .style('color', 'white')
        .on('click', (event, d) => {
          console.log(d, monthMap[d])
          setCurrentMonth(monthMap[d])
          changeMonth(monthMap[d])
          // Remove the current month text
          svg.select("#moods").selectAll(".currentMonthText").remove();
          svg.select("#moods").selectAll(".moodsText").remove();

          // // Top Moods list for that month
          // svg.select("#moods").selectAll(".moodsText")
          //   .data(moods)
          //   .enter().append("text")
          //     .attr("class", "moodsText")
          //     .attr('x', (WIDTH/2))
          //     .attr('y', 
          //       (d, i) => MOODS_Y_STARTER + (i+1)*MOOD_SPACER + MOODS_FONT_SIZE/4)
          //     .text(d => d)
          //     .style('fill', 'black');

      //     svg.select("#moods").selectAll(".moodsText")
      // .data(['a','b','c'])
      // .enter().append("text")
      //   .attr("class", "moodsText")
      //   .attr('x', (WIDTH/2))
      //   .attr('y', 
      //     (d, i) => MOODS_Y_STARTER + (i+1)*MOOD_SPACER + MOODS_FONT_SIZE/4)
      //   .text(d => d)
      //   .style('fill', 'black')
      //   .style('font-size', MOODS_FONT_SIZE);
        })

    // Top Moods list for that month
    // const moods = ['Mysterious', 'Joyful']
    // svg.select("#moods").selectAll(".moodsText")
    //   .data()
    //   .enter().append("text")
    //     .attr("class", "moodsText")
    //     .attr('x', (WIDTH/2))
    //     .attr('y', 
    //       (d, i) => MOODS_Y_STARTER + (i+1)*MOOD_SPACER + MOODS_FONT_SIZE/4)
    //     .text(d => d)
    //     .style('fill', d => moodMap[d])
    //     .style('font-size', MOODS_FONT_SIZE)

    // Top Moods list for that month
    svg.select("#moods").selectAll(".moodsText")
      .data(getMoods())
      .enter().append("text")
        .attr("class", "moodsText")
        .attr('x', (WIDTH/2))
        .attr('y', 
          (d, i) => MOODS_Y_STARTER + (i+1)*MOOD_SPACER + MOODS_FONT_SIZE/4)
        .text(d => d)
        .style('fill', 'black')
        .style('font-size', MOODS_FONT_SIZE);
    
    // Current month
    svg.select("#moods").append("text")
      .attr("class", "currentMonthText")
      .attr('x', (WIDTH/2))
      .attr('y', MOODS_Y_STARTER - MOODS_FONT_SIZE/4)
      .text(reverseMonthMap[currentMonth])
      .style('fill', 'black')
      .style('font-size', MOODS_FONT_SIZE);
    

    // Top Moods list for that month
    svg.select("#moods").selectAll(".moodsText")
      .data(['a','b','c'])
      .enter().append("text")
        .attr("class", "moodsText")
        .attr('x', (WIDTH/2))
        .attr('y', 
          (d, i) => MOODS_Y_STARTER + (i+1)*MOOD_SPACER + MOODS_FONT_SIZE/4)
        .text(d => d)
        .style('fill', 'black')
        .style('font-size', MOODS_FONT_SIZE);
    
      
      
  }, [months, changeMonth, monthMap, currentMonth, data, reverseMonthMap, getMoods])

  return (
      <svg ref={svgRef}></svg>
  )
}

Dial.propTypes = {
  data: PropTypes.array.isRequired,
  changeMonth: PropTypes.func.isRequired,
  lens: PropTypes.string.isRequired
}

export default Dial