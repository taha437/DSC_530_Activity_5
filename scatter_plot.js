function scatter_plot(
  X,
  Y,
  R,
  ColorData,
  axis_key,
  title = "",
  xLabel = "",
  yLabel = "",
  legend = [],
  legendcolors = [],
  margin = 100
) {
  function data_axis_pad(data, pad = 0.05) {
    return [data[0] - pad * data[0], data[1] + pad * data[1]];
  }

  let xScale = d3
    .scaleLinear()
    .domain(data_axis_pad(d3.extent(X)))
    .range([0 + margin, 1000 - margin]);
  let yScale = d3
    .scaleLinear()
    .domain(data_axis_pad(d3.extent(Y)))
    .range([1000 - margin, 0 + margin]);
  let rScale = d3
    .scaleLinear()
    .domain(
      d3.extent(R, function (d) {
        return d;
      })
    )
    .range([4, 12]);
  let colorScale = d3
    .scaleOrdinal()
    .domain(d3.extent(ColorData))
    .range(legendcolors);
  let axis = d3.select(`#${axis_key}`);

  axis
    .selectAll(".markers")
    .data(R)
    .enter()
    .append("g")
    .attr("transform", function (d, i) {
      return `translate(${xScale(X[i])}, ${yScale(Y[i])})`;
    })
    .append("circle")
    .attr("class", function (d, i) {
      return `cls_${i}`;
    })
    .attr("r", function (d) {
      return rScale(d);
    })
    .attr("fill", function (d, i) {
      return colorScale(ColorData[i]);
    })
    .on("mouseenter", function (d, i) {
      let mouse_selected_element_class = d3.select(this).attr("class");
      document.getElementById("adelie").innerHTML =
        "Culmen Length: " +
        String(X[mouse_selected_element_class.substring(4)]) +
        " mm";
      document.getElementById("gentoo").innerHTML =
        "Culmen Depth: " +
        String(Y[mouse_selected_element_class.substring(4)]) +
        " mm";
      document.getElementById("chinstrap").innerHTML =
        "Flipper Length: " +
        String(R[mouse_selected_element_class.substring(4)]) +
        " mm";
      d3.selectAll(`circle`)
        .classed("highlighted", false)
        .attr("r", function (d) {
          return rScale(d);
        });
      d3.selectAll(`.${mouse_selected_element_class}`)
        .classed("highlighted", true)
        .transition()
        .duration(1000)
        .ease(d3.easeBounceOut)
        .attr("r", function (d) {
          return rScale(d) * 4;
        });
    })
    .on("mouseleave", function () {
      d3.selectAll(`circle`)
        .classed("highlighted", false)
        .transition()
        .duration(1000)
        .ease(d3.easeBounceOut)
        .attr("r", function (d) {
          return rScale(d);
        });
    });

  // x and y Axis function
  let x_axis = d3.axisBottom(xScale).ticks(4);
  let y_axis = d3.axisLeft(yScale).ticks(4);
  //X Axis
  axis
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${0},${1000 - margin})`)
    .call(x_axis);
  // Y Axis
  axis
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${margin},${0})`)
    .call(y_axis);
  // Labels
  axis
    .append("g")
    .attr("class", "label")
    .attr("transform", `translate(${500},${1000 - 10})`)
    .append("text")
    .attr("class", "label")
    .attr("text-anchor", "middle")
    .text(xLabel);

  axis
    .append("g")
    .attr("transform", `translate(${40},${500}) rotate(270)`)
    .append("text")
    .attr("class", "label")
    .attr("text-anchor", "middle")
    .text(yLabel);
  // Title
  axis
    .append("text")
    .attr("x", 500)
    .attr("y", 80)
    .attr("text-anchor", "middle")
    .text(title)
    .attr("class", "plotTitle");
  // Legend
  if (legend.length > 0) {
    legend.forEach(function (d, i) {
      let space = 50;
      let lgnd = axis
        .append("g")
        .attr("transform", `translate(${900},${i * 50 + space})`);
      lgnd
        .append("rect")
        .attr("width", function (d) {
          return 40;
        })
        .attr("height", function (d) {
          return 40;
        })
        .attr("fill", function (d) {
          return legendcolors[i];
        })
        .attr("class", d);
      lgnd
        .append("text")
        .attr("class", "legend")
        .attr("dx", "-80")
        .attr("dy", "30")
        .text(d);
    });
  }
}
