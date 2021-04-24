import { Component } from "react";
import Suitable from "../components/Suitable";
import AnswerClassifier from "../plugins/AnswerClassifier";
import analyser from "sentiment-ptbr";
import key from "../plugins/key";

export default class AnswerPrinter extends Component {
  valids = [];
  invalids = [];

  constructor(props) {
    super(props);
    this.classifier = new AnswerClassifier();

    this.props.answers.forEach((item) => {
      const response = {
        ...item,
        answer: item.answer.trim(),
        sentment: analyser(item.answer),
      };
      const { answer } = response;
      if (
        answer &&
        (answer.length > 1 || (!isNaN(parseFloat(answer)) && isFinite(answer)))
      ) {
        this.valids.push(response);
      } else {
        this.invalids.push(response);
      }
    });
  }

  categoryAnswer(type, item, items = null) {
    const sets =
      items === null
        ? this.classifier.groupByCategories(type.key, this.valids)
        : items;
    const areas = [];
    Object.keys(sets).forEach((set) => {
      const content = item(sets[set]);
      areas.push({
        key: `${set}: ${sets[set].length}`,
        color: set.toLowerCase(),
        content,
      });
    });
    return <Suitable areas={areas} start-closed></Suitable>;
  }

  summaryAnswer(answers, maxText, minText) {
    const max = Object.keys(answers).reduce(
      (acc, key) => {
        return answers[key] > acc.total ? { key, total: answers[key] } : acc;
      },
      { total: 0 }
    );

    const min = Object.keys(answers).reduce(
      (acc, key) => {
        return answers[key] < acc.total || acc.total === 0
          ? { key, total: answers[key] }
          : acc;
      },
      { total: 0 }
    );

    maxText = maxText ? (
      maxText
    ) : (
      <span>
        was the option that you got the <b>most responses</b>
      </span>
    );

    minText = minText ? (
      minText
    ) : (
      <span>
        was the option that you received the <b>fewest responses</b>
      </span>
    );

    const areas = [
      {
        key: "Summary",
        content: (
          <ul>
            <li>
              <b>"{max.key}"</b> {maxText} . {max.total} in total
            </li>
            <li>
              <b>"{min.key}"</b> {minText}. {min.total} in total
            </li>
          </ul>
        ),
      },
      {
        key: "Compiled data",
        content: (
          <ul>
            {Object.keys(answers).map((i) => (
              <li key={key(`ctst-${i}`)}>
                {i}: {answers[i]}
              </li>
            ))}
          </ul>
        ),
      },
    ];

    return (
      <div>
        <Suitable areas={areas} />
      </div>
    );
  }

  presentByType() {
    const type = this.props["question-classification"];

    return (
      type.answers &&
      type.answers.printStyle &&
      this[`${type.answers.printStyle}`] &&
      this[`${type.answers.printStyle}`](type)
    );
  }
}
