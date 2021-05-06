import { Component } from "react";
import Btn from "../Btn";
import "./style.sass";

export default class SentimentItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: "",
    };
  }
  change = (color) => {
    this.setState(
      {
        color: this.state.color === color ? "" : color,
      },
      () => {
        if (this.props.onChange) {
          this.props.onChange(color);
        }
      }
    );
  };
  render() {
    const color = this.state.color
      ? ` c-sentiment-item--${this.state.color}`
      : "";
    return (
      <li className={`c-sentiment-item${color}`}>
        {this.props.format ? (
          this.props.format(this.props.item)
        ) : (
          <>
            {this.props.item.answer}
            {!this.props["hide-sentiment"] && (
              <ul>
                <li>Sentiment Score: {this.props.item.sentiment.score}</li>
              </ul>
            )}
            <div className="c-sentiment-item__control">
              {this.props.categories.map((k) => (
                <Btn small color={k} key={k} onClick={() => this.change(k)}>
                  Change to {k}
                </Btn>
              ))}
            </div>
          </>
        )}
      </li>
    );
  }
}
