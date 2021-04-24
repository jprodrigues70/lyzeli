import { Component } from "react";
import Suitable from "../Suitable";
import "./style.sass";
import analyser from "sentiment-ptbr";
import key from "../../plugins/key";
import AnswerClassifier from "../../plugins/AnswerClassifier";
import AnswerPrinter from "../../contracts/AnswerPrinter";

export default class AnswerPane extends AnswerPrinter {
  summarizeDates() {
    const answers = this.valids
      .map((i) => i.answer.split(" ")[0])
      .reduce((acc, item) => {
        acc[item] = acc[item] ? acc[item] + 1 : 1;
        return acc;
      }, []);
    return this.summaryAnswer(
      answers,
      <span>
        was the day that you got the <b>most responses</b>
      </span>,
      <span>
        was the day that received the <b>fewest responses</b>
      </span>
    );
  }

  summarizeCityState() {
    const answers = AnswerClassifier.groupCityAnswers(this.valids);
    return this.summaryAnswer(
      answers,
      <span>
        was the place that you got the <b>most responses</b>
      </span>,
      <span>
        was the place that received the <b>fewest responses</b>
      </span>
    );
  }

  summarize() {
    const answers = AnswerClassifier.groupAnswers(this.valids);
    return this.summaryAnswer(answers);
  }

  categorizeAndMerge(type) {
    return this.categoryAnswer(type, (set) => {
      const grouped = AnswerClassifier.groupAnswers(set);
      return (
        <ul>
          {Object.keys(grouped).map((i) => (
            <li key={key(`categorie-${i}`)}>
              <b>{i}</b>: {grouped[i]} respondents
            </li>
          ))}
        </ul>
      );
    });
  }

  categorize(type) {
    return this.categoryAnswer(type, (set) => {
      return (
        <ul>
          {set.map((i) => (
            <li key={key(`nol-${i.line}`)}>{i.answer}</li>
          ))}
        </ul>
      );
    });
  }

  scoreSentmentsAndCategorize(type) {
    const answers = AnswerClassifier.groupByScore(this.valids);

    return this.categoryAnswer(
      type,
      (set) => {
        return (
          <ul>
            {set.map((i) => (
              <li key={key(`fdbk-${i.line}`)}>
                {i.answer}
                <ul>
                  <li>Sentment Score: {i.sentment.score}</li>
                </ul>
              </li>
            ))}
          </ul>
        );
      },
      answers
    );
  }

  render() {
    return (
      <div className="c-answer-pane">
        <div className="c-answer-pane__counters">
          <div className="c-answer-pane__counters-item">
            Valids: {this.valids.length}
          </div>
          <div className="c-answer-pane__counters-item">
            Invalids: {this.invalids.length}
          </div>
        </div>
        <div className="c-answer-pane__body">{this.presentByType()}</div>
      </div>
    );
  }
}
