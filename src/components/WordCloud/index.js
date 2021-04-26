import { Component, createRef } from "react";
import wc from "wordcloud";
import Loading from "../../assets/loading.gif";

export default class WordCloud extends Component {
  canvas = createRef();
  _unbind = [];
  constructor(props) {
    super(props);
    this.state = { loading: false };
  }
  componentDidMount() {
    this.bindEventListeners();
    wc(this.canvas.current, {
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
  onStart = () => {
    this.setState({ loading: true });
  };
  onWordDrawn = () => {};
  onStop = () => {
    this.setState({ loading: false });
  };
  bindEventListeners() {
    const { onStart, onStop, onWordDrawn } = this;
    const { current: canvas } = this.canvas;

    // too early
    if (!canvas) return;

    // bind all handlers
    [
      ["wordcloudstart", onStart],
      ["wordclouddrawn", onWordDrawn],
      ["wordcloudstop", onStop],
    ].forEach(([event, handler]) => {
      if (!handler) return;

      canvas.addEventListener(event, handler);

      this._unbind.push(() => {
        canvas.removeEventListener(event, handler);
      });
    });
  }
  unbindEventListeners() {
    const { current } = this.canvas;

    if (current) {
      this._unbind.forEach((handler) => handler());
    }

    this._unbind = [];
  }
  componentWillUnmount() {
    this.unbindEventListeners();
  }
  render() {
    return (
      <div
        style={{
          textAlign: "center",
          position: "relative",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <img
          className={`${!this.state.loading && "v--hide"}`}
          src={Loading}
          alt="Loading..."
          style={{
            display: "flex",
            margin: "auto",
            width: "150px",
            position: "absolute",
            top: "78px",
            alignItems: "center",
            borderRadius: "8px",
          }}
        ></img>
        <canvas ref={this.canvas} width="700" height="500"></canvas>
      </div>
    );
  }
}
