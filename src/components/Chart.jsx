import PropTypes from "prop-types";
import * as d3 from "d3";
import { useEffect, useRef } from "react";

function Chart({ data }) {
  const chart = useRef();
  console.log(data);
  useEffect(() => {
    const width = window.innerWidth * 0.9;
    const height = window.innerHeight * 0.7;

    const colors = [
      "#1f77b4",
      "#aec7e8",
      "#ff7f0e",
      "#ffbb78",
      "#2ca02c",
      "#98df8a",
      "#d62728",
      "#ff9896",
      "#9467bd",
      "#c5b0d5",
      "#8c564b",
      "#c49c94",
      "#e377c2",
      "#f7b6d2",
      "#7f7f7f",
      "#c7c7c7",
      "#bcbd22",
      "#dbdb8d",
      "#17becf",
      "#9edae5",
    ];

    const fader = (d) => d3.interpolateRgb(d, "#fff")(0.2);
    const colorScheme = d3.scaleOrdinal().range(colors.map(fader));

    const hierarchy = d3
      .hierarchy(data.data, (d) => {
        return d.children;
      })
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value);

    const treemap = d3
      .treemap()
      .size([width, height - window.innerHeight * 0.1]);
    treemap(hierarchy);

    const svg = d3.select(chart.current);

    const block = svg
      .selectAll("g")
      .data(hierarchy.leaves())
      .join(
        (enter) => enter.append("g"),
        (update) =>
          update.attr("transform", (d) => `translate(${d.x0}, ${d.y0})`),
        (exit) => exit.remove()
      )
      .attr("x", (d) => d.x0)
      .attr("y", (y) => y.y0)
      .attr("transfrom", (d) => `translate(${d.x0}, ${d.y0})`);

    block
      .append("rect")
      .classed("tile", true)
      .attr("data-name", (d) => d.data.name)
      .attr("data-category", (d) => d.data.category)
      .attr("data-value", (d) => d.data.value)
      .attr("width", (d) => d.x1 - d.x0 - 1)
      .attr("height", (d) => d.y1 - d.y0 - 1)
      .attr("fill", (d) => colorScheme(d.data.category));

    block
      .append("text")
      .attr("x", 5)
      .attr("y", 12)
      .attr("font-size", "0.4rem")
      .text(
        (d) =>
          `${d.data.name
            .split(" ")
            .map((char) => char[0])
            .join("")}`
      );

    const category = data.data.children.map((item) => item.name);

    const legendX = d3.scaleBand().domain(category).range([0, width]);

    const legend = svg
      .append("g")
      .attr("id", "legend")
      .attr("transform", `translate(0, ${height - window.innerHeight * 0.08})`);

    legend
      .selectAll("rect")
      .data(category)
      .join(
        (enter) => enter.append("rect"),
        (exit) => exit.remove()
      )
      .attr("width", 16)
      .attr("height", 16)
      .attr("x", (d) => legendX(d))
      .attr("fill", (d) => colorScheme(d));

    legend
      .selectAll("text")
      .data(category)
      .join(
        (enter) => enter.append("text"),
        (exit) => exit.remove()
      )
      .attr("id", (d) => `text-${d}`)
      .attr("x", (d) => legendX(d) + 20)
      .attr("y", 16 * 0.8)
      .attr("font-size", "0.8rem")
      .text((d) => d);
  }, [data]);

  return (
    <div id="chart-container" className="flex flex-col gap-2">
      <h1 id="title" className="text-2xl font-semibold">
        {data.title}
      </h1>
      <p id="description" className="text-sm font-light">
        {data.description}
      </p>
      <svg ref={chart} className="w-[90vw] h-[70vh]"></svg>
    </div>
  );
}

Chart.propTypes = {
  data: PropTypes.object.isRequired,
};

export default Chart;