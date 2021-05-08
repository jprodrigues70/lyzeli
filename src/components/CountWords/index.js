import { Component } from "react";

export default class CountWords extends Component {
  render() {
    const words = Object.keys(this.props.words).sort(
      (a, b) => this.props.words[b] - this.props.words[a]
    );

    return (
      <ul>
        {words.map((i) => (
          <li key={i}>
            {i}: {this.props.words[i]}
          </li>
        ))}
      </ul>
    );
  }
}
