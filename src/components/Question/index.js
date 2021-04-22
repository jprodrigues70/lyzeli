import { Component } from "react";
import QuestionParser from "../../plugins/QuestionParser";
import AnswerPane from "../AnswerPane";
import "./style.sass";
import { Context } from "../../store";
import Dropdown from "../Dropdown";
import CsvExtractor from "../../plugins/CsvExtractor";

export default class Question extends Component {
  static contextType = Context;

  constructor(props, context) {
    super(props, context);
    this.rows = this.context.state["database.table"].rows || [];
    this.classifications =
      this.context.state["database.table"].classifications || [];
    this.state = {
      classification: QuestionParser.getType(
        this.classifications[this.props.position]
      ),
    };
  }

  onSelect(classification) {
    this.setState({
      classification,
    });

    this.classifications[this.props.position] = classification.key;

    CsvExtractor.update(this.context.state["database.key"], {
      titles: this.context.state["database.table"].titles,
      rows: this.context.state["database.table"].rows,
      classifications: this.classifications,
    });
  }

  render() {
    const answers = this.rows.map((row, line) => ({
      line,
      answer: row[this.props.position],
    }));

    return (
      <div className="c-question">
        <div className="c-question__header">
          <div>
            <h2 className="c-question__title">{this.props.title}</h2>
            <p className="c-question__subtitle">
              {this.state.classification?.title}
            </p>
          </div>
          <div className="c-question__settings">
            <Dropdown
              items={QuestionParser.getTypes()}
              onSelect={(item) => this.onSelect(item)}
            ></Dropdown>
          </div>
        </div>
        <div className="c-question__body">
          <AnswerPane
            question-classification={this.state.classification}
            answers={answers}
          ></AnswerPane>
        </div>
      </div>
    );
  }
}
