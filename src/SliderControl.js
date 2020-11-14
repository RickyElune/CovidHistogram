import React from "react";
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";
import Histogram from "./Histogram";

export default class SliderControl extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //  Initial displayed range
            valueRange: {
                min: 2,
                max: 9,
            },

            //  The displayed range filtered by the slider
            valueRangeUpdated: {
                min: 2,
                max: 9,
            },
        };
    }

    render() {
        let updatedRange = this.state.valueRange;
        let histogram = <Histogram valueRange={updatedRange} />;
        return (
            <div>
                {histogram}
                <label>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    Drag the slider below to specify interval range
                </label>
                <br />
                <br />
                <InputRange
                    step={0.1}
                    maxValue={30}
                    minValue={0}
                    formatLabel={(value) => value.toFixed(1)}
                    value={this.state.valueRange}
                    onChange={(value) => {
                        this.setState({ valueRange: value });
                    }}
                    onChangeComplete={(value) =>
                        this.setState({ valueRangeUpdated: value })
                    }
                />
            </div>
        );
    }
}
