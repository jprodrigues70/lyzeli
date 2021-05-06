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
    const { rows, classifications, manualSettings } = this.context.state[
      "database.table"
    ];
    this.rows = rows || [];
    this.classifications = classifications || [];
    this.manualSettings = manualSettings || [];

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

    const table = JSON.parse(localStorage.getItem("database"))[
      this.context.state["database.key"]
    ];

    this.classifications[this.props.position] = classification.key;

    CsvExtractor.update(this.context.state["database.key"], {
      ...table,
      classifications: this.classifications,
    });
  }

  onClick = (item) => {
    this.props.onAnswerClick(item, this.state.classification);
  };

  render() {
    let answers = this.rows;

    this.props.filters.forEach((f) => {
      answers = answers.filter((i) =>
        f.filter(i, f.params.question, f.params.answer)
      );
    });

    answers = answers.map((row, line) => ({
      line,
      answer: row[this.props.position],
    }));

    return (
      <div className="c-question">
        <div className="c-question__header">
          <div>
            <h2 className="c-question__title">
              {this.props.position + 1}. {this.props.title}
            </h2>
            <p className="c-question__subtitle">
              {this.state.classification.title}
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
            question={this.props.position}
            onClick={(i) => this.onClick(i)}
          ></AnswerPane>
        </div>
      </div>
    );
  }
}
