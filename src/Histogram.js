import React from "react";
import * as d3 from "d3";
import "react-input-range/lib/css/index.css";

var data = require("./main/JeanData.json");
var data2 = require("./main/JeanData2.json");
// var bins = d3.bin().thresholds(40)(data);

export default class Histogram extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.myRef = React.createRef();
        this.svg = d3.select(this.myRef.current).append("svg");

        //  Update data range
        this.dataFiltered = data.filter(this.checkRange.bind(this));
        this.dataFiltered2 = data2.filter(this.checkRange.bind(this));

        //  Total number of pairs in the figure
        this.amountShown = this.dataFiltered.length;
        this.amountShown2 = this.dataFiltered2.length;
    }

    //  Data range filter
    checkRange(interval) {
        const { valueRange } = this.props;
        return interval >= valueRange["min"] && interval <= valueRange["max"];
    }

    //  Initial render of the graph
    componentDidMount() {
        let height = 500;
        let width = 1000;
        let margin = { top: 20, right: 20, bottom: 30, left: 40 };

        let dataFiltered = data.filter(this.checkRange.bind(this));
        this.amountShown = dataFiltered.length;

        let dataFiltered2 = data2.filter(this.checkRange.bind(this));
        this.amountShown2 = dataFiltered2.length;

        //  Change the number in thresholds to change the number of bins in svg
        let bins = d3.bin().thresholds(30)(dataFiltered);
        let bins2 = d3.bin().thresholds(30)(dataFiltered2);
        // let bins = d3.bin().thresholds(40)(data);

        let x = d3
            .scaleLinear()
            .domain([bins[0].x0, bins[bins.length - 1].x1])
            .range([margin.left, width - margin.right]);

        let y = d3
            .scaleLinear()
            .domain([0, d3.max(bins, (d) => d.length)])
            .nice()
            .range([height - margin.bottom, margin.top]);

        let xAxis = (g) =>
            g
                .attr("transform", `translate(0,${height - margin.bottom})`)
                .call(
                    d3
                        .axisBottom(x)
                        .ticks(width / 80)
                        .tickSizeOuter(0)
                )
                .call((g) =>
                    g
                        .append("text")
                        .attr("x", width - margin.right)
                        .attr("y", -4)
                        .attr("fill", "currentColor")
                        .attr("font-weight", "bold")
                        .attr("text-anchor", "end")
                        .text(data.x)
                );

        let yAxis = (g) =>
            g
                .attr("transform", `translate(${margin.left},0)`)
                .call(d3.axisLeft(y).ticks(height / 40))
                .call((g) => g.select(".domain").remove())
                .call((g) =>
                    g
                        .select(".tick:last-of-type text")
                        .clone()
                        .attr("x", 4)
                        .attr("text-anchor", "start")
                        .attr("font-weight", "bold")
                        .text(data.y)
                );

        this.svg = d3
            .select(this.myRef.current)
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        this.svg
            .append("g")
            .selectAll("rect")
            .data(bins)
            .join("rect")
            .attr("x", (d) => x(d.x0) + 1)
            .attr("width", (d) => Math.max(0, x(d.x1) - x(d.x0) - 1))
            .attr("y", (d) => y(d.length))
            .attr("height", (d) => y(0) - y(d.length))
            .style("fill", "steelblue")
            .style("opacity", 0.4);

        this.svg
            .append("g")
            .selectAll("rect")
            .data(bins2)
            .join("rect")
            .attr("x", (d) => x(d.x0) + 1)
            .attr("width", (d) => Math.max(0, x(d.x1) - x(d.x0) - 1))
            .attr("y", (d) => y(d.length))
            .attr("height", (d) => y(0) - y(d.length))
            .style("fill", "green")
            .style("opacity", 0.4);

        this.svg.append("g").call(xAxis);

        this.svg.append("g").call(yAxis);

        // Handmade legend
        this.svg
            .append("circle")
            .attr("cx", 700)
            .attr("cy", 30)
            .attr("r", 6)
            .style("fill", "steelblue");
        this.svg
            .append("circle")
            .attr("cx", 700)
            .attr("cy", 60)
            .attr("r", 6)
            .style("fill", "green");
        this.svg
            .append("text")
            .attr("x", 720)
            .attr("y", 30)
            .text("Community A: " + this.amountShown)
            .style("font-size", "15px")
            .attr("alignment-baseline", "middle");
        this.svg
            .append("text")
            .attr("x", 720)
            .attr("y", 60)
            .text("Community B: " + this.amountShown2)
            .style("font-size", "15px")
            .attr("alignment-baseline", "middle");
    }

    //  Refresh the svg graph when dragging the slider
    componentDidUpdate() {
        //  first clear the canvas and redraw
        d3.selectAll(this.svg).remove();

        let height = 500;
        let width = 1000;
        let margin = { top: 20, right: 20, bottom: 30, left: 40 };

        let dataFiltered = data.filter(this.checkRange.bind(this));
        this.amountShown = dataFiltered.length;

        let dataFiltered2 = data2.filter(this.checkRange.bind(this));
        this.amountShown2 = dataFiltered2.length;

        //  Change the number in thresholds to change the number of bins in svg
        let bins = d3.bin().thresholds(30)(dataFiltered);
        let bins2 = d3.bin().thresholds(30)(dataFiltered2);
        // let bins = d3.bin().thresholds(40)(data);

        let x = d3
            .scaleLinear()
            .domain([bins[0].x0, bins[bins.length - 1].x1])
            .range([margin.left, width - margin.right]);

        let y = d3
            .scaleLinear()
            .domain([0, d3.max(bins, (d) => d.length)])
            .nice()
            .range([height - margin.bottom, margin.top]);

        let xAxis = (g) =>
            g
                .attr("transform", `translate(0,${height - margin.bottom})`)
                .call(
                    d3
                        .axisBottom(x)
                        .ticks(width / 80)
                        .tickSizeOuter(0)
                )
                .call((g) =>
                    g
                        .append("text")
                        .attr("x", width - margin.right)
                        .attr("y", -4)
                        .attr("fill", "currentColor")
                        .attr("font-weight", "bold")
                        .attr("text-anchor", "end")
                        .text(data.x)
                );

        let yAxis = (g) =>
            g
                .attr("transform", `translate(${margin.left},0)`)
                .call(d3.axisLeft(y).ticks(height / 40))
                .call((g) => g.select(".domain").remove())
                .call((g) =>
                    g
                        .select(".tick:last-of-type text")
                        .clone()
                        .attr("x", 4)
                        .attr("text-anchor", "start")
                        .attr("font-weight", "bold")
                        .text(data.y)
                );

        this.svg = d3
            .select(this.myRef.current)
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        this.svg
            .append("g")
            .selectAll("rect")
            .data(bins)
            .join("rect")
            .attr("x", (d) => x(d.x0) + 1)
            .attr("width", (d) => Math.max(0, x(d.x1) - x(d.x0) - 1))
            .attr("y", (d) => y(d.length))
            .attr("height", (d) => y(0) - y(d.length))
            .style("fill", "steelblue")
            .style("opacity", 0.4);

        this.svg
            .append("g")
            .selectAll("rect")
            .data(bins2)
            .join("rect")
            .attr("x", (d) => x(d.x0) + 1)
            .attr("width", (d) => Math.max(0, x(d.x1) - x(d.x0) - 1))
            .attr("y", (d) => y(d.length))
            .attr("height", (d) => y(0) - y(d.length))
            .style("fill", "green")
            .style("opacity", 0.4);

        this.svg.append("g").call(xAxis);

        this.svg.append("g").call(yAxis);

        // Handmade legend
        this.svg
            .append("circle")
            .attr("cx", 700)
            .attr("cy", 30)
            .attr("r", 6)
            .style("fill", "steelblue");
        this.svg
            .append("circle")
            .attr("cx", 700)
            .attr("cy", 60)
            .attr("r", 6)
            .style("fill", "green");
        this.svg
            .append("text")
            .attr("x", 720)
            .attr("y", 30)
            .text("Community A: " + this.amountShown)
            .style("font-size", "15px")
            .attr("alignment-baseline", "middle");
        this.svg
            .append("text")
            .attr("x", 720)
            .attr("y", 60)
            .text("Community B: " + this.amountShown2)
            .style("font-size", "15px")
            .attr("alignment-baseline", "middle");
    }

    render() {
        return (
            <div>
                <label>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    Number of infector-infectee pairs in the specified range:
                </label>
                <div ref={this.myRef}></div>
            </div>
        );
    }
}
