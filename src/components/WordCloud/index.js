import { Component, createRef } from "react";
import wc from "wordcloud";

export default class WordCloud extends Component {
  chartRef = createRef();
  componentDidMount() {
    wc(this.chartRef.current, {
      list: this.props.word,
      weightFactor: (size) => {
        return (size * 700) / 80;
      },
      gridSize: 10,
      minSize: 5,
      drawOutOfBound: false,
      hover: window.drawBox,
    });
  }
  render() {
    return (
      <div style={{ textAlign: "center" }}>
        <canvas ref={this.chartRef} width="700" height="500"></canvas>
      </div>
    );
  }
}
