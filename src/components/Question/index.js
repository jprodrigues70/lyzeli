import { Component } from "react";
import Dropdown from "../Dropdown";
import AnswerPane from "../AnswerPane";
import CsvExtractor from "../../plugins/CsvExtractor";
import { Context } from "../../store";
import "./style.sass";
export default class Question extends Component {
  static contextType = Context;

  constructor(props, context) {
    super(props, context);
    const { rows, classifications } = this.context.state["database.table"];
    this.rows = rows || [];
    this.classifications = classifications || [];

    this.state = {
      classification: this.props.classifier.getOption(
        this.classifications[this.props.position]
      ),
    };
  }

  onChange(classification) {
    this.setState({
      classification,
    });

    this.classifications[this.props.position] = classification.key;

    CsvExtractor.update(this.context.state["database.key"], {
      titles: this.context.state["database.table"].titles,
      rows: this.rows,
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
              items={this.props.classifier.options}
              onChange={(item) => this.onChange(item)}
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
