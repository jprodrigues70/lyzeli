import { Component } from "react";
import Suitable from "../components/Suitable";
import AnswerClassifier from "../plugins/AnswerClassifier";
import Sentiment from "sentiment";
import key from "../plugins/key";
import { Context } from "../store";

import analyser from "sentiment-ptbr";

import color from "../plugins/color";
import Chart from "../components/Chart";
import WordCloud from "../components/WordCloud";
import stopwords from "../phrases/stopwords";
import Arr from "../plugins/Arr";
import Str from "../plugins/Str";
import "./style.sass";
import CsvExtractor from "../plugins/CsvExtractor";
import pattern from "patternomaly";
import CountWords from "../components/CountWords";
import AnswerTreatment from "../plugins/AnswerTreatment";
export default class AnswerPrinter extends Component {
  static contextType = Context;
  valids = [];
  invalids = [];
  patterns = [
    "plus",
    "cross",
    "dash",
    "cross-dash",
    "dot",
    "dot-dash",
    "disc",
    "ring",
    "line",
    "line-vertical",
    "weave",
    "zigzag",
    "zigzag-vertical",
    "diagonal",
    "diagonal-right-left",
    "square",
    "box",
    "diamond",
    "diamond-box",
  ];
  constructor(props, context) {
    super(props, context);
    this.classifier = new AnswerClassifier();
    this.table = JSON.parse(localStorage.getItem("database")) || {};
    const an = new Sentiment();
    this.props.answers.forEach((item) => {
      const response = {
        ...item,
        answer: item.answer.trim(),
        question: this.props.question,
        sentiment:
          this.props.language === "en"
            ? an.analyze(item.answer)
            : analyser(item.answer),
        manualSetting:
          this.table?.manualSettings?.[this.props.question]?.[item.line],
        comments: this.table?.comments?.[this.props.question]?.[item.line],
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
            ? this.classifier.groupByCategories(
                type.key,
                this.valids,
                this.props.language
              )
            : items),
        },
      },
      () => {
        const onComment = (answer, comment, category, remove = false) => {
          let sets = this.state.sets;
          const user = JSON.parse(localStorage.getItem("user"));
          category = Str.ucfirst(category);

          sets[category] = sets[category].filter(
            (a) => a.line !== answer.line && a.question === answer.question
          );

          if (
            answer?.comments?.[type.key]?.[`${user.login}@${user.id}`]?.find(
              (f) => f.id === comment.id
            ) &&
            !remove
          ) {
            return;
          }

          const operation = {
            [type.key]: {
              ...answer?.comments?.[type.key],
              [`${user.login}@${user.id}`]: remove
                ? (
                    answer?.comments?.[type.key]?.[
                      `${user.login}@${user.id}`
                    ] || []
                  ).filter((i) => i.id !== comment.id)
                : Arr.unique(
                    [
                      ...(answer?.comments?.[type.key]?.[
                        `${user.login}@${user.id}`
                      ] || []),
                      comment,
                    ],
                    "id"
                  ),
            },
          };

          sets[category] = [
            ...sets[category],
            {
              ...answer,
              comments: {
                ...(answer.comments || {}),
                ...operation,
              },
            },
          ];

          sets[category].sort((a, b) => a.line - b.line);

          this.setState(
            {
              sets: sets,
            },
            () => {
              const table = JSON.parse(localStorage.getItem("database"));

              const comments = {
                [answer.question]: {
                  ...(table?.comments?.[answer.question] || {}),
                  [answer.line]: {
                    ...(table?.comments?.[answer.question]?.[answer.line] ||
                      {}),
                    ...operation,
                  },
                },
              };

              const database = {
                ...table,
                comments: {
                  ...(table?.comments || {}),
                  ...comments,
                },
              };

              this.props.parallel.dispatch({
                action: "change.setTo",
                payload:
                  parseInt(this.props.parallel.state["change.count"]) + 1,
              });

              CsvExtractor.update(database);
              this.categoryAnswerChange(
                type,
                item,
                onComment,
                change,
                category
              );
            }
          );
        };

        const change = (answer, from, to) => {
          to = Str.ucfirst(to);
          from = Str.ucfirst(from);

          this.setState(
            {
              sets: {
                ...this.state.sets,
                [to]: this.state.sets[to].filter((j) => j.line !== answer.line),
                [from]: [
                  { ...answer, sentimentManual: from },
                  ...this.state.sets[from],
                ],
              },
            },
            () => {
              const table = JSON.parse(localStorage.getItem("database"));

              const manualSettings = {
                [answer.question]: {
                  ...(table?.manualSettings?.[answer.question] || {}),
                  [answer.line]: {
                    ...(table?.manualSettings?.[answer.question]?.[
                      answer.line
                    ] || {}),
                    [type.key]: from,
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

              this.props.parallel.dispatch({
                action: "change.setTo",
                payload:
                  parseInt(this.props.parallel.state["change.count"]) + 1,
              });

              CsvExtractor.update(database);
              this.categoryAnswerChange(type, item, onComment, change, to);
            }
          );
        };
        this.categoryAnswerChange(type, item, onComment, change);
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
            backgroundColor: labels.map((i, index) => {
              const p = this.patterns[index]
                ? this.patterns[index]
                : this.patterns[
                    Math.floor(Math.random() * this.patterns.length)
                  ];
              return pattern.draw(p, color.string2Hex(i), "#FFF", 13);
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

  countWords = (labels) => {
    return labels
      .flatMap((i) =>
        this.state.sets[i].flatMap((j) => {
          const raw = Str.normalizeAndRemoveAllNumbers(j.answer)
            .toLowerCase()
            .replace("'", "")
            .replace("/", " ")
            .split(" ")
            .filter(
              (k) =>
                !stopwords[this.props.language]
                  .map((s) => Str.normalize(s))
                  .includes(k) && k.length > 1
            );
          return [...new Set(raw)];
        })
      )
      .reduce((acc, item) => {
        acc[item] = acc[item] ? acc[item] + 1 : 1;
        return acc;
      }, {});
  };

  wordCloudData = (labels) => {
    const countWords = this.countWords(labels);

    return Object.keys(countWords)
      .sort((a, b) => countWords[b] - countWords[a])
      .map((i) => [i, countWords[i]]);
  };

  categoryAnswerChange = (type, item, onComment = null, change, startsAt) => {
    const areas = [];
    const answersKeys = Object.keys(this.state.sets);

    answersKeys.forEach((set) => {
      const content = item(
        this.state.sets[set],
        set.toLowerCase(),
        change,
        answersKeys.map((i) => i.toLowerCase()),
        onComment
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
          <div className="c-chart-area" style={{ maxWidth: "600px" }}>
            <Chart type={"bar"} data={data} options={options}></Chart>
          </div>
        ),
      });

      if (type.answers && type.answers.wordCloud) {
        areas.push({
          key: "Word Cloud (lento)",
          content: () => <WordCloud word={this.wordCloudData(answersKeys)} />,
        });

        areas.push({
          key: "Count Words",
          content: () => <CountWords words={this.countWords(answersKeys)} />,
        });
      }
    }

    const component = <Suitable areas={areas} start-closed></Suitable>;
    this.setState({ component });
  };

  summaryAnswer(answers, maxText, minText, type, onClick) {
    let answersKeys = Object.keys(answers);
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

    const check = (a) => {
      return this.valids.find(
        (k) =>
          ((AnswerTreatment[type.key] &&
            AnswerTreatment[type.key](k.answer) === a) ||
            (!AnswerTreatment[type.key] && k.answer === a)) &&
          k.isFiltered
      );
    };

    const maxClasses = ["c-answer"];

    if (check(max.key)) {
      maxClasses.push("c-answer__ghost");
    }

    const minClasses = ["c-answer"];

    if (check(min.key)) {
      minClasses.push("c-answer__ghost");
    }

    let content = (
      <ul>
        <li className={maxClasses.join(" ")}>
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
        <li className={minClasses.join(" ")}>
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
          <li className={maxClasses.join(" ")}>
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
            {answersKeys.map((i) => {
              const classes = ["c-answer"];

              if (check(i)) {
                classes.push("c-answer__ghost");
              }
              return (
                <li key={key(`ctst-${i}`)} className={classes.join(" ")}>
                  {onClick ? (
                    <button className="v--link" onClick={() => onClick(i)}>
                      <b>{i}</b>
                    </button>
                  ) : (
                    i
                  )}
                  : <b>{answers[i]}</b> (
                  {this.valids.length > 0
                    ? `${((answers[i] * 100) / this.valids.length).toFixed(2)}%`
                    : ""}
                  )
                </li>
              );
            })}
          </ul>
        ),
      },
      {
        key: "LaTeX table",
        content: () => (
          <textarea
            rows="12"
            style={{ width: "100%", padding: "8px" }}
            defaultValue={`\\begin{table*}[ht]
    \\centering
    \\def \\arraystretch{1.3}
    \\begin{tabular}{|p{6cm}|c|c|}
        \\hline
        \\bf Option & \\bf Frequency & \\bf Percentage\\\\
        \\hline\n${answersKeys
          .map((i) => {
            return `        ${i} & ${answers[i]} & ${
              this.valids.length > 0
                ? `${((answers[i] * 100) / this.valids.length).toFixed(2)}\\%`
                : "-"
            }\\\\\n        \\hline`;
          })
          .join("\n")}
    \\end{tabular}
    \\caption{${this.table.titles[this.props.question]}}
    \\label{question:Q${this.props.question + 1}}
\\end{table*}`}
          ></textarea>
        ),
      },
    ];

    const fAnswersKeys = answersKeys.filter((i) => !check(i));
    // this.valids = this.valids.filter((i) => !i.isFiltered);
    const data = {
      labels: fAnswersKeys,
      datasets: [
        {
          label: "# Of respondents",
          data: fAnswersKeys.map((i) => answers[i]),
          backgroundColor: fAnswersKeys.map((i, index) => {
            const j = answersKeys.length - index;

            const p = this.patterns[index]
              ? this.patterns[index]
              : this.patterns[Math.floor(Math.random() * this.patterns.length)];

            if (j < 10 && j >= 0) {
              return pattern.draw(p, color.firstTemColors(j), "#FFF", 13);
            }
            return pattern.draw(p, color.string2Hex(i), "#FFF", 13);
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
        <div className="c-chart-area">
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
      type?.answers &&
      type?.answers.printStyle &&
      this[`${type?.answers.printStyle}`] &&
      this[`${type?.answers.printStyle}`](type, this.props.onClick)
    );
  }
}
