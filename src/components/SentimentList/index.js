import { Component } from "react";
import key from "../../plugins/key";
import SentimentItem from "../SentimentItem";
import "./style.sass";

export default class SentimentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      set: this.props.list,
    };
  }

  render() {
    return (
      <ul className="c-sentiment-list">
        {this.state.set.map((i) => {
          const categories = this.props.categories.filter(
            (j) => j !== this.props.category
          );

          return (
            <SentimentItem
              item={i}
              categories={categories}
              key={key(`fdbk-${i.line}`)}
              onChange={(to) => this.props.change(i, to, this.props.category)}
              onComment={(comment) =>
                this.props.onComment(i, comment, this.props.category)
              }
              onRemoveComment={(comment) =>
                this.props.onComment(i, comment, this.props.category, true)
              }
              type={this.props.type}
              hide-sentiment={this.props["hide-sentiment"]}
            />
          );
        })}
      </ul>
    );
  }
}
