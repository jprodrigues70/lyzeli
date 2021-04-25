import { Component } from "react";
import Suitable from "../components/Suitable";
import AnswerClassifier from "../plugins/AnswerClassifier";
import analyser from "sentiment-ptbr";
import key from "../plugins/key";

import color from "../plugins/color";
import Chart from "../components/Chart";
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
    const answersKeys = Object.keys(sets);
    answersKeys.forEach((set) => {
      const content = item(sets[set]);
      areas.push({
        key: `${set}: ${sets[set].length}`,
        color: set.toLowerCase(),
        content,
      });
    });

    if (answersKeys.length > 1) {
      const data = {
        labels: answersKeys,
        datasets: [
          {
            maxBarThickness: 24,
            label: false,
            data: answersKeys.map((i) => sets[i].length),
            backgroundColor: answersKeys.map((i, index) => {
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
      };

      areas.push({
        key: "Chart",
        content: (
          <div
            style={{
              maxWidth: "600px",
              width: "100%",
              margin: "0 auto",
              position: "relative",
              overflow: "auto",
            }}
          >
            <Chart type={"bar"} data={data} options={options}></Chart>
          </div>
        ),
      });
    }
    return <Suitable areas={areas} start-closed></Suitable>;
  }

  summaryAnswer(answers, maxText, minText) {
    const answersKeys = Object.keys(answers);
    const max = answersKeys.reduce(
      (acc, key) => {
        return answers[key] > acc.total ? { key, total: answers[key] } : acc;
      },
      { total: 0 }
    );

    const min = answersKeys.reduce(
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
            {answersKeys.map((i) => (
              <li key={key(`ctst-${i}`)}>
                {i}: {answers[i]}
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
      content: (
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
