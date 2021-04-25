import { Component, createRef } from "react";

import Chartjs from "chart.js/auto";

export default class Chart extends Component {
  chartRef = createRef();

  componentDidMount() {
    const myChartRef = this.chartRef.current.getContext("2d");
    new Chartjs(myChartRef, {
      type: this.props.type,
      data: this.props.data,
      options: this.props.options,
    });
  }

  render() {
    return <canvas style={{ height: "auto" }} ref={this.chartRef}></canvas>;
  }
}
