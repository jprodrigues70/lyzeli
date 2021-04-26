import { Component } from "react";
import Question from "../Question";
import "./style.sass";
import { Context } from "../../store";
import key from "../../plugins/key";
import QuestionClassifier from "../../plugins/QuestionClassifier";

export default class QuestionMapper extends Component {
  static contextType = Context;

  constructor(props, context) {
    super(props, context);

    const table = this.context.state["database.table"];
    this.titles = (table && table.titles) || [];
  }

  render() {
    const classifier = new QuestionClassifier();

    return (
      <div className="c-question-mapper">
        <div className="c-question-mapper__questions">
          {this.titles.map((item, index) => {
            return (
              <Question
                title={item}
                position={index}
                key={key(`question-${index}`)}
                classifier={classifier}
              ></Question>
            );
          })}
        </div>
      </div>
    );
  }
}
