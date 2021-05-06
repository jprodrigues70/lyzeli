import { Component } from "react";
import Suitable from "../components/Suitable";
import AnswerClassifier from "../plugins/AnswerClassifier";
import analyser from "sentiment-ptbr";
import key from "../plugins/key";
import { Context } from "../store";

import color from "../plugins/color";
import Chart from "../components/Chart";
import WordCloud from "../components/WordCloud";
import stopwords from "../phrases/stopwords";
import Str from "../plugins/Str";
import "./style.sass";
import CsvExtractor from "../plugins/CsvExtractor";

export default class AnswerPrinter extends Component {
  static contextType = Context;
  valids = [];
  invalids = [];

  constructor(props, context) {
    super(props, context);
    this.classifier = new AnswerClassifier();
    this.table = localStorage.getItem("database")
      ? JSON.parse(localStorage.getItem("database"))[
          this.context.state["database.key"]
        ]
      : {};
    this.props.answers.forEach((item) => {
      const response = {
        ...item,
        answer: item.answer.trim(),
        question: this.props.question,
        sentiment: analyser(item.answer),
        manualSetting: this.table?.manualSettings?.[this.props.question]?.[
          item.line
        ],
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

    this.state = {
      component: <div></div>,
      sets: {},
    };
  }

  categoryAnswer = (type, item, items = null) => {
    this.setState(
      {
        sets: {
          ...(items === null
            ? this.classifier.groupByCategories(type.key, this.valids)
            : items),
        },
      },
      () => {
        const change = (i, k, o) => {
          o = Str.ucfirst(o);
          k = Str.ucfirst(k);
          this.setState(
            {
              sets: {
                ...this.state.sets,
                [o]: this.state.sets[o].filter((j) => j.line !== i.line),
                [k]: [{ ...i, sentimentManual: k }, ...this.state.sets[k]],
              },
            },
            () => {
              const table = JSON.parse(localStorage.getItem("database"))[
                this.context.state["database.key"]
              ];
              const manualSettings = {
                [i.question]: {
                  ...(table?.manualSettings?.[i.question] || {}),
                  [i.line]: {
                    ...(table?.manualSettings?.[i.question]?.[i.line] || {}),
                    [type.key]: k,
                  },
                },
              };

              const database = {
                ...table,
                manualSettings: {
                  ...(table?.manualSettings || {}),
                  ...manualSettings,
                },
              };

              CsvExtractor.update(this.context.state["database.key"], database);
              this.categoryAnswerChange(type, item, items, change, o);
            }
          );
        };
        this.categoryAnswerChange(type, item, items, change);
      }
    );
  };

  mountCategoryChart = (labels) => {
    return {
      data: {
        labels,
        datasets: [
          {
            maxBarThickness: 24,
            label: false,
            data: labels.map((i) => this.state.sets[i].length),
            backgroundColor: labels.map((i) => {
              return color.string2Hex(i);
            }),
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: false,
            text: "Number of valids respondents",
          },
          legend: {
            display: false,
            position: "right",
          },
          tooltip: {
            callbacks: {
              label: function ({ dataset, parsed }) {
                const total = dataset.data.reduce((acc, i) => (acc += i), 0);
                const percentage = parseFloat(
                  ((parsed.y / total) * 100).toFixed(2)
                );

                return `${parsed.y} (${percentage}%)` || "";
              },
              title: function (context) {
                return context[0].label;
              },
            },
          },
        },
      },
    };
  };

  wordCloudData = (labels) => {
    const countWords = labels
      .flatMap((i) =>
        this.state.sets[i].flatMap((j) =>
          Str.normalizeAndRemoveAllNumbers(j.answer)
            .toLowerCase()
            .split(" ")
            .filter(
              (k) =>
                !stopwords.map((s) => Str.normalize(s)).includes(k) &&
                k.length > 1
            )
        )
      )
      .reduce((acc, item) => {
        acc[item] = acc[item] ? acc[item] + 1 : 1;
        return acc;
      }, {});

    return Object.keys(countWords)
      .sort((a, b) => countWords[b] - countWords[a])
      .map((i) => [i, countWords[i]]);
  };

  categoryAnswerChange = (type, item, items = null, change, startsAt) => {
    const areas = [];
    const answersKeys = Object.keys(this.state.sets);

    answersKeys.forEach((set) => {
      const content = item(
        this.state.sets[set],
        set.toLowerCase(),
        change,
        answersKeys.map((i) => i.toLowerCase())
      );
      areas.push({
        key: `${set}: ${this.state.sets[set].length}`,
        color: set.toLowerCase(),
        content,
      });
    });

    if (answersKeys.length > 1) {
      const { data, options } = this.mountCategoryChart(answersKeys);

      areas.push({
        key: "Chart",
        content: () => (
          <div className="c-chart-area">
            <Chart type={"bar"} data={data} options={options}></Chart>
          </div>
        ),
      });

      if (type.answers && type.answers.wordCloud) {
        areas.push({
          key: "Word Cloud (lento)",
          content: () => <WordCloud word={this.wordCloudData(answersKeys)} />,
        });
      }
    }

    const component = <Suitable areas={areas} start-closed></Suitable>;
    this.setState({ component });
  };

  summaryAnswer(answers, maxText, minText, type, onClick) {
    const answersKeys = Object.keys(answers);
    const max = answersKeys.reduce(
      (acc, key) => {
        return answers[key] > acc.total ? { key, total: answers[key] } : acc;
      },
      { total: 0 }
    );

    const min = answersKeys.reverse().reduce(
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
    let content = (
      <ul>
        <li>
          "
          {onClick ? (
            <button className="v--link" onClick={() => onClick(max.key)}>
              <b>{max.key}</b>
            </button>
          ) : (
            max.key
          )}
          " {maxText} . {max.total} in total
        </li>
        <li>
          "
          {onClick ? (
            <button className="v--link" onClick={() => onClick(min.key)}>
              <b>{min.key}</b>
            </button>
          ) : (
            min.key
          )}
          " {minText}. {min.total} in total
        </li>
      </ul>
    );
    if (max.key === min.key) {
      content = (
        <ul>
          <li>
            "
            {onClick ? (
              <button className="v--link" onClick={() => onClick(max.key)}>
                <b>{max.key}</b>
              </button>
            ) : (
              max.key
            )}
            " {maxText} . {max.total} in total
          </li>
        </ul>
      );
    }
    const areas = [
      {
        key: "Summary",
        content: () => content,
      },
      {
        key: "Compiled data",
        content: () => (
          <ul>
            {answersKeys.map((i) => (
              <li key={key(`ctst-${i}`)}>
                {onClick ? (
                  <button className="v--link" onClick={() => onClick(i)}>
                    <b>{i}</b>
                  </button>
                ) : (
                  i
                )}
                : {answers[i]}
              </li>
            ))}
          </ul>
        ),
      },
    ];

    const data = {
      labels: answersKeys,
      datasets: [
        {
          label: "# Of respondents",
          data: answersKeys.map((i) => answers[i]),
          backgroundColor: answersKeys.map((i, index) => {
            const j = answersKeys.length - index;
            if (j < 10 && j >= 0) {
              return color.firstTemColors(j);
            }
            return color.string2Hex(i);
          }),
        },
      ],
    };
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: false,
          text: "Number of valids respondents",
        },
        legend: {
          display: true,
          position: "right",
        },
        tooltip: {
          callbacks: {
            label: function ({ dataset, parsed }) {
              const total = dataset.data.reduce((acc, i) => (acc += i), 0);
              const percentage = parseFloat(
                ((parsed / total) * 100).toFixed(2)
              );

              return `${parsed} (${percentage}%)` || "";
            },
            title: function (context) {
              return context[0].label;
            },
          },
        },
      },
    };

    areas.push({
      key: "Chart",
      content: () => (
        <div
          style={{
            maxWidth: "600px",
            width: "100%",
            margin: "0 auto",
            position: "relative",
            overflow: "auto",
          }}
        >
          <Chart type={"pie"} data={data} options={options}></Chart>
        </div>
      ),
    });
    const component = <Suitable areas={areas} />;
    this.setState({ component });
  }

  presentByType() {
    const type = this.props["question-classification"];

    return (
      type.answers &&
      type.answers.printStyle &&
      this[`${type.answers.printStyle}`] &&
      this[`${type.answers.printStyle}`](type, this.props.onClick)
    );
  }
}
