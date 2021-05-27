import { Component } from "react";
import Question from "../Question";
import "./style.sass";
import { Context } from "../../store";
import key from "../../plugins/key";
import QuestionClassifier from "../../plugins/QuestionClassifier";
import AnswerTreatment from "../../plugins/AnswerTreatment";
import { ParallelContext } from "../../parallelStore";

export default class QuestionMapper extends Component {
  static contextType = Context;

  constructor(props, context) {
    super(props, context);

    const table = this.context.state["database.table"];
    this.titles = (table && table.titles) || [];
    this.state = {
      filters: [
        {
          filter: (i) => i,
          params: {
            question: null,
            answer: "",
          },
        },
      ],
      phrase: [],
    };
  }

  removeFilter = (f, i) => {
    let filters = [...this.state.filters];
    const filterIndex = filters.findIndex(
      (i) => i.params.question === f.params.question
    );

    if (filterIndex >= 0) {
      filters[filterIndex].params.answers = filters[
        filterIndex
      ].params.answers.filter((j) => j !== i);
      if (!filters[filterIndex].params.answers.length) {
        filters = filters.filter(
          (i) => !(i.params.question === f.params.question)
        );
      }
    }

    this.setState({
      filters,
      phrase: this.getPhrase(filters),
    });
  };

  /**
   * Here filters are mounted.
   * When the question is stil in the filters list, we put the selected answer as an OR option grouped in the same question.
   * When the question is new, we put the selected answer as an AND operation, and it adds a line on filters list.
   * We don't have OR operation between 2 different questions
   *
   * @param {int} question
   * @param {string} answer
   * @param {object} classification
   */
  onAnswerClick = (question, answer, classification) => {
    const questionIsInFilter = this.state.filters.findIndex(
      (i) => i.params.question === question
    );
    let filters = [...this.state.filters];
    if (questionIsInFilter < 0) {
      // AND operation
      filters.push({
        filter: (i, question, answers) => {
          if (AnswerTreatment[classification.key]) {
            return answers.includes(
              AnswerTreatment[classification.key](i[question])
            );
          }
          return answers.includes(i[question]);
        },
        params: {
          question,
          answers: [answer],
        },
      });
    } else {
      // OR operation
      if (filters[questionIsInFilter].params.answers.includes(answer)) {
        filters[questionIsInFilter].params.answers = filters[
          questionIsInFilter
        ].params.answers.filter((i) => i !== answer);
      } else {
        filters[questionIsInFilter].params.answers.push(answer);
      }

      if (!filters[questionIsInFilter].params.answers.length) {
        filters = filters.filter(
          (i) =>
            !(i.params.question === filters[questionIsInFilter].params.question)
        );
      }
    }

    this.setState({
      filters,
      phrase: this.getPhrase(filters),
    });
  };

  /**
   * Here we print the query string
   *
   * @param {array} filters
   * @returns
   */
  getPhrase = (filters) => {
    return filters.reduce((acc, f) => {
      if (f.params.question === null) {
        return acc;
      }

      return [
        ...acc,
        <>
          {f.params.answers.length > 1 && (
            <span key={key("leftb")} className="c-question-mapper__filter">
              (
            </span>
          )}
          {f.params.answers
            .map((i) => (
              <span
                onClick={() => this.removeFilter(f, i)}
                className="c-question-mapper__filter"
                key={key(`${f.params.question}-${i.replace(/\s/g, "-")}`)}
              >
                {`Q.${f.params.question + 1} = "${i}"`}
              </span>
            ))
            .reduce((prev, curr) => [
              prev,
              <span key={key("or")} className="c-question-mapper__operator">
                OR
              </span>,
              curr,
            ])}
          {f.params.answers.length > 1 && (
            <span key={key("rghtb")} className="c-question-mapper__filter">
              )
            </span>
          )}
        </>,
      ];
    }, []);
  };

  render() {
    const classifier = new QuestionClassifier();

    return this.titles.length ? (
      <div className="c-question-mapper">
        {this.state.phrase.length ? (
          <p className="c-question-mapper__query">
            {this.state.phrase
              .map((i) => i)
              .reduce((prev, curr) => [
                prev,
                <span key={key("and")} className="c-question-mapper__operator">
                  AND
                </span>,
                curr,
              ])}
          </p>
        ) : (
          ""
        )}
        <div className="c-question-mapper__questions">
          {this.titles.map((item, index) => {
            return (
              <ParallelContext.Consumer key={key(`question-${index}`)}>
                {(parallel) => (
                  <Question
                    parallel={parallel}
                    title={item}
                    position={index}
                    classifier={classifier}
                    onAnswerClick={(i, classification) =>
                      this.onAnswerClick(index, i, classification)
                    }
                    filters={this.state.filters}
                  ></Question>
                )}
              </ParallelContext.Consumer>
            );
          })}
        </div>
      </div>
    ) : (
      <>
        <h1>You don't have a dataset. Please, create one.</h1>
      </>
    );
  }
}
