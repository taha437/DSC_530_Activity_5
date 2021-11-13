function bar_plot(
  Values, //column values to make histogram of
  bins_count = 10, // number of the bins desired
  axis_key, // id of the svg
  title = "", // title of the figure
  xLabel = "", // xlabel
  yLabel = "", //ylabel
  margin = 80
) {
  // assign which SVG element should be the host for the figure
  let axis = d3.select(`#${axis_key}`);
  let height = parseInt(axis.attr("height") + margin);
  let width = parseInt(axis.attr("width")) - margin;

  // make a linear scale for the X Axis
  // we will use this for making bins and placing them
  let xScale = d3
    .scaleLinear()
    .domain(d3.extent(Values))
    .range([margin, width]);

  // histogram function makes bins and the values for each bin
  // use xScale and number bins to calculate the bisn location and value
  let histogram = d3
    .histogram()
    .value(function (d) {
      return d;
    })
    .domain(xScale.domain())
    .thresholds(bins_count);

  let bins = histogram(Values);
  const formatter = d3.format(",.2f");

  // y will represent number of elements inside each bin!
  let yScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(bins, function (d) {
        return d.length;
      }),
    ])
    .range([height, 0]);

  // pass the bins and plot them

  let y_axis = d3.axisLeft(yScale).ticks(3);
  axis
    .selectAll(".bars")
    .data(bins) // array of arrays (each array inside it is the values inside one bin)
    .enter()
    .append("g")
    .attr("class", "bars")
    .attr("transform", function (d) {
      return `translate(${xScale(d.x0)} ,${yScale(d.length)} )`;
    })
    .append("rect")
    .attr("width", function (d) {
      return (width - margin) / bins_count;
    })
    .attr("height", function (d) {
      return height - yScale(d.length);
    })
    .style("fill", "#14213d");
  axis
    .append("g")
    .attr("class", "axis")
    .style("font", "14px times")
    .attr("transform", `translate(${margin},${0})`)
    .call(y_axis);
}

function h_bar_plot(
  Values, //column values to make histogram of
  bins_count = 10, // number of the bins desired
  axis_key, // id of the svg
  title = "", // title of the figure
  xLabel = "", // xlabel
  yLabel = "", //ylabel
  margin = 80
) {
  // assign which SVG element should be the host for the figure
  let axis = d3.select(`#${axis_key}`);
  let height = parseInt(axis.attr("height")) - margin;
  let width = parseInt(axis.attr("width"));

  // in horizontal histogram chart, width is the number of elements in the bin
  // hight is the bin number
  // Step 1 make y scale to use it's ticks for the histogram
  let yScale = d3
    .scaleLinear()
    .domain(d3.extent(Values))
    .range([height, margin]);

  // step 2 get the histogram data
  let histogram = d3
    .histogram()
    .value(function (d) {
      return d;
    })
    .domain(yScale.domain())
    .thresholds(yScale.ticks(bins_count + 1));

  // step 3 use the data to calculate histogram bin values
  let bins = histogram(Values);
  // step 4, now that we have the  bins and their numbers we can make the xscale
  let xScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(bins, function (d) {
        return d.length;
      }),
    ])
    .range([0, width]);

  // now that we have the scales let us add the bars to the svg
  let y_axis = d3.axisBottom(xScale).ticks(4);
  axis
    .selectAll(".bars")
    .data(bins) // array of arrays (each array inside it is the values inside one bin)
    .enter()
    .append("g") // add one group per bar, shift it to position of bar
    .attr("class", "bars")
    .attr("transform", function (d, i) {
      return `translate(${0} ,${yScale(d.x0)} )`;
    })
    .append("rect") // width of the bar is equal to the length of elements in the bin
    .attr("width", function (d) {
      return xScale(d.length);
    })
    .attr("height", function () {
      return (height / bins_count) * 0.5;
    }) // static bar thickness!
    .style("fill", "#14213d");
  axis
    .append("g")
    .attr("class", "axis")
    .style("font", "14px times")
    .attr("transform", "translate(5," + 50 + ")")
    .call(y_axis);
}
