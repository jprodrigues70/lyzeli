import { Component } from "react";
import QuestionParser from "../../plugins/QuestionParser";
import Suitable from "../Suitable";
import "./style.sass";
import analyser from "sentiment-ptbr";
import key from "../../plugins/key";

export default class AnswerPane extends Component {
  valids() {
    return this.props.answers
      .map((i) => ({
        ...i,
        sentment: analyser(i.answer),
      }))
      .filter((i) => {
        const answer = i.answer.trim();

        return (
          answer &&
          (answer.length > 1 ||
            (!isNaN(parseFloat(answer)) && isFinite(answer)))
        );
      });
  }
  invalids() {
    return this.props.answers
      .map((i) => ({
        ...i,
        sentment: analyser(i.answer),
      }))
      .filter((i) => {
        const answer = i.answer.trim();

        return !(
          answer &&
          (answer.length > 1 ||
            (!isNaN(parseFloat(answer)) && isFinite(answer)))
        );
      });
  }
  validsLength() {
    return this.valids().length;
  }
  invalidsLength() {
    return this.invalids().length;
  }

  timestampQuestion() {
    const groupByDate = this.valids()
      .map((i) => i.answer.split(" ")[0])
      .reduce((acc, item) => {
        acc[item] = acc[item] ? acc[item] + 1 : 1;
        return acc;
      }, []);

    const max = Object.keys(groupByDate).reduce(
      (acc, i) => {
        return groupByDate[i] > acc.total
          ? { key: i, total: groupByDate[i] }
          : acc;
      },
      { total: 0 }
    );

    const min = Object.keys(groupByDate).reduce(
      (acc, i) => {
        return groupByDate[i] < acc.total || groupByDate[i] === 1
          ? { key: i, total: groupByDate[i] }
          : acc;
      },
      { total: 0 }
    );
    const areas = [
      {
        key: "Summary",
        content: (
          <ul>
            <li>
              {max.key} was the day that you got the <b>most responses</b>.{" "}
              {max.total} in total.
            </li>
            <li>
              {min.key} was the day that received the <b>fewest responses</b>.{" "}
              {min.total} in total
            </li>
          </ul>
        ),
      },
      {
        key: "Compiled data",
        content: (
          <ul>
            {Object.keys(groupByDate).map((i) => (
              <li key={key(`ts-cd-${i}`)}>
                {i}: {groupByDate[i]}
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

  npsLikeQuestion(type) {
    const answers = QuestionParser.npsClassifie(type.key, this.valids());
    const keys = Object.keys(answers).filter(
      (i) => typeof answers[i] !== "number"
    );
    const areas = [];

    keys.forEach((item) => {
      const grouped = QuestionParser.groupAnswers(answers[item]);

      const list = (
        <ul>
          {grouped.map((item, index) => {
            return (
              <li key={key(`nps-n-${index}`)}>
                Nota {index}: {item}
              </li>
            );
          })}
        </ul>
      );
      areas.push({
        key: `${item}: ${answers[item].length}`,
        color: item,
        content: list,
      });
    });

    return <Suitable areas={areas} start-closed></Suitable>;
  }

  openQuestionQuestion() {
    const areas = [
      {
        key: "Show answers",
        content: (
          <ul>
            {this.valids().map((answer, i) => (
              <li key={key(`oq-${i}`)}>{answer.answer}</li>
            ))}
          </ul>
        ),
      },
    ];
    return <Suitable areas={areas} start-closed></Suitable>;
  }

  feedbackQuestion() {
    const answers = QuestionParser.groupByScore(this.valids());
    const keys = Object.keys(answers);
    const areas = [];

    keys.forEach((item) => {
      const list = (
        <ul>
          {answers[item].map((i) => (
            <li key={key(`feedback-${i}`)}>
              {i.answer}
              <ul>
                <li>Sentment Score: {i.sentment.score}</li>
              </ul>
            </li>
          ))}
        </ul>
      );
      areas.push({
        key: `${item}: ${answers[item].length}`,
        color: item,
        content: list,
      });
    });

    return <Suitable areas={areas} start-closed></Suitable>;
  }

  cityStateQuestion() {
    const answers = QuestionParser.groupCityAnswers(this.valids());

    const max = Object.keys(answers).reduce(
      (acc, i) => {
        return answers[i] > acc.total ? { key: i, total: answers[i] } : acc;
      },
      { total: 0 }
    );

    const min = Object.keys(answers).reduce(
      (acc, i) => {
        return answers[i] < acc.total || answers[i] === 1
          ? { key: i, total: answers[i] }
          : acc;
      },
      { total: 0 }
    );

    const areas = [
      {
        key: "Summary",
        content: (
          <ul>
            <li>
              <b>"{max.key}"</b> was the option that you got the{" "}
              <b>most responses</b>. {max.total} in total
            </li>
            <li>
              <b>"{min.key}"</b> was the option that you received the{" "}
              <b>fewest responses</b>. {min.total} in total
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

  groupsInAnswerQuestion() {
    const answers = QuestionParser.groupAnswers(this.valids());

    const max = Object.keys(answers).reduce(
      (acc, i) => {
        return answers[i] > acc.total ? { key: i, total: answers[i] } : acc;
      },
      { total: 0 }
    );

    const min = Object.keys(answers).reduce(
      (acc, i) => {
        return answers[i] < acc.total || acc.total === 0
          ? { key: i, total: answers[i] }
          : acc;
      },
      { total: 0 }
    );

    const areas = [
      {
        key: "Summary",
        content: (
          <ul>
            <li>
              <b>"{max.key}"</b> was the option that you got the{" "}
              <b>most responses</b>. {max.total} in total
            </li>
            <li>
              <b>"{min.key}"</b> was the option that you received the{" "}
              <b>fewest responses</b>. {min.total} in total
            </li>
          </ul>
        ),
      },
      {
        key: "Compiled data",
        content: (
          <ul>
            {Object.keys(answers).map((i) => (
              <li key={key(`gp-a-${i}`)}>
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

  yesOrNotQuestion(type) {
    const answers = QuestionParser.classifieAnswersByPositiveOrNegative(
      type.key,
      this.valids()
    );
    const keys = Object.keys(answers);
    const areas = [];

    keys.forEach((item) => {
      const grouped = QuestionParser.groupAnswers(answers[item]);
      const list = (
        <ul>
          {Object.keys(grouped).map((i) => (
            <li key={key(`yon-${i}`)}>
              {i}: {grouped[i]} respondents
            </li>
          ))}
        </ul>
      );
      areas.push({
        key: `${item}: ${answers[item].length}`,
        color: item,
        content: list,
      });
    });
    return <Suitable areas={areas} start-closed></Suitable>;
  }

  negativeOrListQuestion(type) {
    const answers = QuestionParser.classifieAnswersByPositiveOrNegative(
      type.key,
      this.valids()
    );
    const keys = Object.keys(answers);
    const areas = [];

    keys.forEach((item) => {
      const list = (
        <ul>
          {answers[item].map((i) => (
            <li key={key(`feedback-${i}`)}>{i.answer}</li>
          ))}
        </ul>
      );
      areas.push({
        key: `${item}: ${answers[item].length}`,
        color: item,
        content: list,
      });
    });

    return <Suitable areas={areas} start-closed></Suitable>;
  }

  termsQuestion(type) {
    const answers = QuestionParser.classifieAnswersByPositiveOrNegative(
      type.key,
      this.valids()
    );
    const keys = Object.keys(answers);
    const areas = [];

    keys.forEach((item) => {
      const grouped = QuestionParser.groupAnswers(answers[item]);
      const list = (
        <ul>
          {Object.keys(grouped).map((i) => (
            <li key={key(`terms-${i}`)}>
              {i}: {grouped[i]}
            </li>
          ))}
        </ul>
      );
      areas.push({
        key: `${item}: ${answers[item].length}`,
        color: item,
        content: list,
      });
    });
    return <Suitable areas={areas} start-closed></Suitable>;
  }

  presentByType() {
    const type = this.props["question-classification"];
    return this[`${type.key}Question`] && this[`${type.key}Question`](type);
  }

  render() {
    return (
      <div className="c-answer-pane">
        <div className="c-answer-pane__counters">
          <div className="c-answer-pane__counters-item">
            Valids: {this.validsLength()}
          </div>
          <div className="c-answer-pane__counters-item">
            Invalids: {this.invalidsLength()}
          </div>
        </div>
        <div className="c-answer-pane__body">{this.presentByType()}</div>
      </div>
    );
  }
}
