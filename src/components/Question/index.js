import { Component } from "react";
import Dropdown from "../Dropdown";
import AnswerPane from "../AnswerPane";
import CsvExtractor from "../../plugins/CsvExtractor";
import { Context } from "../../store";
import "./style.sass";
import AnswerTreatment from "../../plugins/AnswerTreatment";
export default class Question extends Component {
  static contextType = Context;

  constructor(props, context) {
    super(props, context);
    const { language, rows, classifications, manualSettings } =
      this.context.state["database.table"];
    this.language = language;
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

    const table = JSON.parse(localStorage.getItem("database"));

    this.classifications[this.props.position] = classification.key;

    this.props.parallel.dispatch({
      action: "change.setTo",
      payload: parseInt(this.props.parallel.state["change.count"]) + 1,
    });
    CsvExtractor.update({
      ...table,
      classifications: this.classifications,
    });
  }

  onClick = (item) => {
    this.props.onAnswerClick(item, this.state.classification);
  };

  render() {
    let answers = this.rows;
    let isInFilter = false;

    this.props.filters.forEach((f) => {
      if (f.params.question !== this.props.position) {
        answers = answers.filter((i) =>
          f.filter(i, f.params.question, f.params.answers)
        );
      }
    });

    let answers_valids = [];
    const filter_of_question = this.props.filters.find(
      (i) => i.params.question === this.props.position
    );

    if (filter_of_question) {
      answers_valids = filter_of_question.params.answers;
    }

    const value = (item) => {
      if (AnswerTreatment[this.state.classification.key]) {
        return AnswerTreatment[this.state.classification.key](item);
      }
      return item;
    };

    answers = answers.map((row, line) => ({
      line,
      answer: row[this.props.position],
      isFiltered:
        answers_valids.length &&
        !answers_valids.includes(value(row[this.props.position])),
    }));

    let classes = ["c-question"];
    if (isInFilter) {
      classes.push("c-question--in-filter");
    }

    return (
      <div className={classes.join(" ")}>
        <div className="c-question__header">
          <div>
            <h2 className="c-question__title">
              {this.props.position + 1}. {this.props.title}
            </h2>
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
            parallel={this.props.parallel}
            language={this.language}
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
