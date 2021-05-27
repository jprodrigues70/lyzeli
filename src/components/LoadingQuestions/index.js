import { Component } from "react";

import "./style.sass";

export default class LoadingQuestions extends Component {
  render() {
    const items = [1, 2, 3, 4, 5, 6];
    return (
      <div className="c-loading-questions c-suitable">
        <div className="c-suitable__header">
          <div className="c-suitable__header-controls">
            <div className="c-loading-questions__button"></div>
            <div className="c-loading-questions__button"></div>
          </div>
        </div>
        <div className="c-question-mapper__questions">
          {items.map((i) => (
            <div className="c-question" key={i}>
              <div className="c-question__header">
                <div>
                  <div className="c-loading-questions__title"></div>
                  <div className="c-loading-questions__subtitle"></div>
                </div>
                <div className="c-loading-questions__button"></div>
              </div>
              <div className="c-question__body">
                <div className="c-loading-questions__subtitle"></div>
                <div className="c-loading-questions__title"></div>
                <div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
