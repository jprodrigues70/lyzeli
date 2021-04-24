import { Component } from "react";
import Question from "../Question";
import "./style.sass";
import { Context } from "../../store";
import key from "../../plugins/key";
import QuestionClassifier from "../../plugins/questionClassifier";

export default class QuestionMapper extends Component {
  static contextType = Context;

  menuItems() {
    const table = this.context.state["database.table"];
    return (table && table.titles) || [];
  }

  render() {
    const classifier = new QuestionClassifier();

    return (
      <div className="c-question-mapper">
        <div className="c-question-mapper__questions">
          {this.menuItems().map((item, index) => {
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
