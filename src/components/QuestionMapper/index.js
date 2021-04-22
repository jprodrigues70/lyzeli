import { Component } from "react";
import Question from "../Question";
import "./style.sass";
import { Context } from "../../store";
import key from "../../plugins/key";

export default class QuestionMapper extends Component {
  static contextType = Context;

  menuItems() {
    const table = this.context.state["database.table"];
    return (table && table.titles) || [];
  }

  render() {
    return (
      <div className="c-question-mapper">
        <div className="c-question-mapper__questions">
          {this.menuItems().map((item, index) => {
            return (
              <Question
                title={item}
                position={index}
                key={key(`question-${index}`)}
              ></Question>
            );
          })}
        </div>
      </div>
    );
  }
}
