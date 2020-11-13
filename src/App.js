import React from "react";
import * as d3 from "d3";
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";

var data = require("./main/JeanData.json");
// var bins = d3.bin().thresholds(40)(data);

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            valueRange: {
                min: 5,
                max: 12,
            },
        };

        this.myRef = React.createRef();
        this.dataFiltered = data.filter(this.checkRange.bind(this));
        this.amountShown = this.dataFiltered.length;
    }

    checkRange(interval) {
        return (
            interval >= this.state.valueRange["min"] &&
            interval <= this.state.valueRange["max"]
        );
    }
    componentDidMount() {
        let height = 500;
        let width = 1000;
        let margin = { top: 20, right: 20, bottom: 30, left: 40 };
        let bins = d3.bin().thresholds(40)(this.dataFiltered);
        // let bins = d3.bin().thresholds(40)(data);
        // var bins = d3.bin().thresholds(40)(data);

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

        let svg = d3
            .select(this.myRef.current)
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        svg.append("g")
            .attr("fill", "steelblue")
            .selectAll("rect")
            .data(bins)
            .join("rect")
            .attr("x", (d) => x(d.x0) + 1)
            .attr("width", (d) => Math.max(0, x(d.x1) - x(d.x0) - 1))
            .attr("y", (d) => y(d.length))
            .attr("height", (d) => y(0) - y(d.length));

        svg.append("g").call(xAxis);

        svg.append("g").call(yAxis);
    }
    render() {
        return (
            <div>
                <label>
                    Number of infector-infectee pairs in the specified range:{" "}
                    {this.amountShown}
                </label>
                <div ref={this.myRef}></div>
                <InputRange
                    step={0.1}
                    maxValue={20}
                    minValue={0}
                    formatLabel={(value) => value.toFixed(1)}
                    value={this.state.valueRange}
                    onChange={(value) => this.setState({ valueRange: value })}
                    onChangeComplete={() => this.componentDidMount()}
                />
            </div>
        );
    }
}
export default App;
