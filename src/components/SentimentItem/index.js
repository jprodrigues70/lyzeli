import { Component } from "react";
import Btn from "../Btn";
import Tag from "../Tag";
import { WithContext as ReactTags } from "react-tag-input";
import "./style.sass";

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];
export default class SentimentItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: "",
      tags: [],
      suggestions: [],
    };
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete(tag) {
    return this.props.onRemoveComment(tag);
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

  consensus = () => {
    const { comments } = this.props.item;
    if (comments && comments[this.props.type.key]) {
      const result = {};

      const authors = Object.keys(comments[this.props.type.key]);
      if (authors.length > 1) {
        authors.forEach((author) => {
          const opinions = comments[this.props.type.key][author];
          opinions.forEach((op) => {
            result[op.text] = [...(result?.[op.text] || []), author];
          });
        });

        return Object.keys(result)
          .filter((i) => result[i].length === authors.length)
          .map((i) => ({ id: i, text: i }));
      }
      return [];
    }
    return [];
  };

  render() {
    const color = this.state.color
      ? ` c-sentiment-item--${this.state.color}`
      : "";
    const { suggestions } = this.state;

    const { answer, sentiment, sentimentManual } = this.props.item;
    const comments = { ...this.props.item.comments };
    const consensus = this.consensus();
    if (consensus && consensus.length) {
      comments[this.props.type.key]["Consensus"] = consensus;
    }

    let authors = [];

    if (comments?.[this.props.type.key]) {
      const people = Object.keys(comments[this.props.type.key]).filter(
        (i) => i !== "Consensus"
      );

      if (people.length > 1) {
        authors = Object.keys(comments[this.props.type.key]);
      } else {
        authors = people;
      }
    }

    const user = JSON.parse(localStorage.getItem("user"));

    return (
      <li className={`c-sentiment-item${color}`}>
        {this.props.format ? (
          this.props.format(this.props.item)
        ) : (
          <>
            <div className="c-sentiment-item__control">
              <div className="c-sentiment-item__control-head">
                <Tag>{sentimentManual ? "Manual" : "Auto"}</Tag>
                {!this.props["hide-sentiment"] && (
                  <Tag>Score: {sentiment.score}</Tag>
                )}
              </div>
              <div className="c-sentiment-item__control-switcher">
                {this.props.categories.map((k) => (
                  <Btn small color={k} key={k} onClick={() => this.change(k)}>
                    <span className="c-sentiment-item__control-switcher-text--hide-xs">
                      Change to{" "}
                    </span>
                    {k}
                  </Btn>
                ))}
              </div>
            </div>
            <div className="c-sentiment-item__text">{answer}</div>
            <div className="c-sentiment-item__comment-area">
              {authors.map((i) => {
                const author = i.split("@");

                return (
                  <div className="c-sentiment-item__comment-tags" key={i}>
                    <div className="c-sentiment-item__author">
                      {author.length > 1 ? (
                        <>
                          <img
                            src={`https://avatars.githubusercontent.com/u/${author[1]}?v=4`}
                            title={author[0]}
                            alt={author[0]}
                          />
                          <a
                            href={`https://github.com/${author[0]}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            @{author[0]}
                          </a>
                        </>
                      ) : (
                        <span>
                          <b>{author}</b>
                        </span>
                      )}
                    </div>
                    <div className="c-sentiment-item__comment-tags-list">
                      {comments[this.props.type.key][i].map((j) => (
                        <Tag
                          key={j.id}
                          closeable={author[0] === user.login}
                          onClose={() => this.handleDelete(j)}
                        >
                          {j.text}
                        </Tag>
                      ))}
                    </div>
                  </div>
                );
              })}
              <ReactTags
                autofocus={false}
                suggestions={suggestions}
                handleDelete={this.handleDelete}
                handleAddition={this.props.onComment}
                handleDrag={this.handleDrag}
                delimiters={delimiters}
              />
            </div>
          </>
        )}
      </li>
    );
  }
}
