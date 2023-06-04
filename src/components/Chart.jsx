import PropTypes from "prop-types";
import * as d3 from "d3";
import { useEffect, useRef } from "react";

function Chart({ data }) {
  const chart = useRef();

  useEffect(() => {
    const width = window.innerWidth * 0.9;
    const height = window.innerHeight * 0.65;

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

    const tooltip = d3.select("#tooltip").style("visibility", "hidden");
    const svg = d3.select(chart.current);

    const map = svg.append("g").attr("id", "map");

    const block = map
      .selectAll("g")
      .data(hierarchy.leaves())
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${d.x0}, ${d.y0})`);

    block
      .append("rect")
      .classed("tile", true)
      .attr("id", (d, i) => `tile-${i}`)
      .attr("data-name", (d) => d.data.name)
      .attr("data-category", (d) => d.data.category)
      .attr("data-value", (d) => d.data.value)
      .attr("width", (d) => d.x1 - d.x0 - 1)
      .attr("height", (d) => d.y1 - d.y0 - 1)
      .attr("fill", (d) => colorScheme(d.data.category))
      .on("mousemove", (e, d) => {
        const element = document.getElementById(e.target.id);
        element.style.opacity = 0.75;

        tooltip.transition().duration(200).style("visibility", "visible");
        tooltip
          .html(
            `
            <span class='tooltip-title'>${d.data.name}</span>
            <span><i>${d.data.category}</i></span>
            <br>
            <span class='tooltip-value'>
                <b>
                    ${d.data.value
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                </b>
            </span>
            `
          )
          .attr("data-value", d.data.value)
          .style("left", () => `${e.pageX - 120}px`)
          .style("top", `${e.pageY - 100}px`);
      })
      .on("mouseout", (e) => {
        const element = document.getElementById(e.target.id);
        element.style.opacity = 1;

        tooltip.style("visibility", "hidden");
      });

    block
      .append("text")
      .attr("x", 5)
      .attr("y", 12)
      .attr("font-size", "0.4rem")
      .style("pointer-events", "none")
      .text(
        (d) =>
          `${d.data.name
            .split(" ")
            .map((char) => char[0])
            .join("")}`
      );

    const category = data.data.children.map((item) => item.name);
    const thirdCategoryLength = Math.ceil(category.length / 3);

    const indexToScale = category
      .slice(0, thirdCategoryLength)
      .map((item, index) => index);

    const legendX = d3.scaleBand().domain(indexToScale).range([0, width]);

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
      .classed("legend-item", true)
      .attr("width", 16)
      .attr("height", 16)
      .attr("x", (d, i) => {
        return legendX(i % thirdCategoryLength);
      })
      .attr("y", (d, i) => {
        if (i >= thirdCategoryLength * 2) return 16 * 4;
        if (i >= thirdCategoryLength * 1) return 16 * 2;
      })
      .attr("fill", (d) => colorScheme(d));

    legend
      .selectAll("text")
      .data(category)
      .join(
        (enter) => enter.append("text"),
        (exit) => exit.remove()
      )
      .attr("id", (d) => `text-${d}`)
      .attr("x", (d, i) => {
        const param = i % thirdCategoryLength;
        return legendX(param) + 20;
      })
      .attr("y", (d, i) => {
        const rectPos = 16;
        const midOfRectPos = 16 * 0.75;

        if (i >= thirdCategoryLength * 2) return rectPos * 4 + midOfRectPos;
        if (i >= thirdCategoryLength * 1) return rectPos * 2 + midOfRectPos;
        return midOfRectPos;
      })
      .attr("font-size", "0.75rem")
      .text((d) => d);
  }, [data]);

  return (
    <div
      id="chart-container"
      className="flex flex-col p-4 shadow-md rounded-lg"
    >
      <h1 id="title" className="text-2xl font-semibold">
        {data.title}
      </h1>
      <p id="description" className="text-sm font-light">
        {data.description}
      </p>
      <div
        id="tooltip"
        className="absolute left-1/2 bg-white/90 w-auto h-auto px-6 py-3 rounded-sm text-xs pointer-events-none flex flex-col"
      ></div>
      <svg ref={chart} className="w-[90vw] h-[70vh] mt-4"></svg>
    </div>
  );
}

Chart.propTypes = {
  data: PropTypes.object.isRequired,
};

export default Chart;
