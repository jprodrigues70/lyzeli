import "./style.sass";
import key from "../../plugins/key";
import AnswerClassifier from "../../plugins/AnswerClassifier";
import AnswerPrinter from "../../contracts/AnswerPrinter";
import SentimentList from "../SentimentList";
import AnswerTreatment from "../../plugins/AnswerTreatment";

export default class AnswerPane extends AnswerPrinter {
  constructor(props, context) {
    super(props, context);
  }

  summarizeDates = (type, onClick) => {
    const answers = this.valids
      .map((i) => AnswerTreatment[type.key](i.answer))
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
      </span>,
      type,
      onClick
    );
  };

  summarizeCityState = (type, onClick) => {
    const answers = AnswerClassifier.groupCityAnswers(this.valids);
    return this.summaryAnswer(
      answers,
      <span>
        was the place that you got the <b>most responses</b>
      </span>,
      <span>
        was the place that received the <b>fewest responses</b>
      </span>,
      type,
      onClick
    );
  };

  summarize = (type, onClick) => {
    const answers = AnswerClassifier.groupAnswers(this.valids);
    return this.summaryAnswer(answers, null, null, type, onClick);
  };

  categorizeAndMerge = (type, onClick) => {
    return this.categoryAnswer(type, (set) => {
      const grouped = AnswerClassifier.groupAnswers(set);

      return () => (
        <ul>
          {Object.keys(grouped).map((i) => (
            <li key={key(`categorie-${i}`)}>
              {onClick ? (
                <button className="v--link" onClick={() => onClick(i)}>
                  <b>{i}</b>
                </button>
              ) : (
                <b>{i}</b>
              )}
              : {grouped[i]} respondents
            </li>
          ))}
        </ul>
      );
    });
  };

  categorize = (type) => {
    return this.categoryAnswer(type, (set, category, change, categories) => {
      if (categories.length > 1) {
        return () => (
          <SentimentList
            list={set}
            category={category}
            categories={categories}
            change={change}
            hide-sentiment={true}
          />
        );
      }
      return () => (
        <ul>
          {set.map((i) => (
            <li key={key(`nol-${i.line}`)}>{i.answer}</li>
          ))}
        </ul>
      );
    });
  };

  scoreSentimentsAndCategorize = (type) => {
    const answers = AnswerClassifier.groupByScore(this.valids, type);

    return this.categoryAnswer(
      type,
      (set, category, change) => {
        return () => (
          <SentimentList
            list={set}
            category={category}
            categories={["negative", "neutral", "positive"]}
            change={change}
          />
        );
      },
      answers
    );
  };

  componentDidMount() {
    this.presentByType();
  }

  componentDidUpdate(a, b) {
    if (
      a["question-classification"] !== this.props["question-classification"]
    ) {
      this.presentByType();
    }
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
        <div className="c-answer-pane__body">{this.state.component}</div>
      </div>
    );
  }
}