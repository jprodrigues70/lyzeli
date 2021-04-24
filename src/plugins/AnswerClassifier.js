import BrazilianStates from "./BrazilianStates";
import Files from "./Files";
import Str from "./Str";

export default class AnswerClassifier {
  constructor() {
    const raw = require.context(`../questions`, true, /.*\.(js)$/);
    this.options = Files.getComponents(raw).map(
      (component) => component.default
    );
  }

  groupByCategories(key, responses) {
    const option = this.options.find((option) => option.key === key);
    const avaiableClassifications = [];
    const { classification: config, alias } = option.answers;
    const classifications = Object.keys(config).reduce(
      (acc, classificationKey) => {
        avaiableClassifications.push(classificationKey);
        acc[classificationKey] = [];
        return acc;
      },
      {}
    );
    avaiableClassifications.push("unclassified");

    let unclassified = [...responses];

    responses.forEach((response) => {
      for (let i = 0; i < avaiableClassifications.length; i++) {
        const classification = config[avaiableClassifications[i]];
        if (classification) {
          const types = Object.keys(classification);
          for (let j = 0; j < types.length; j++) {
            if (
              Str.finder(
                types[j],
                response.answer,
                classification[types[j]],
                false
              )
            ) {
              classifications[avaiableClassifications[i]].push(response);
              unclassified = unclassified.filter(
                (item) => item.line !== response.line
              );
              break;
            }
          }
        }
      }
    });

    classifications.unclassified = unclassified;
    const result = {};

    avaiableClassifications.forEach((item) => {
      const name = (alias && alias[item]) || Str.ucfirst(item);
      result[name] = classifications[item];
    });

    return result;
  }

  static groupAnswers(answers) {
    return answers.reduce((acc, item) => {
      acc[`${item.answer}`] = acc[`${item.answer}`]
        ? acc[`${item.answer}`] + 1
        : 1;
      return acc;
    }, []);
  }

  static groupByScore(answers) {
    return answers.reduce(
      (acc, item) => {
        const opt =
          item?.sentment?.score > 1
            ? "Positive"
            : item?.sentment?.score < -1
            ? "Negative"
            : "Neutral";
        acc[opt] = [...acc[opt], item];
        return acc;
      },
      { Negative: [], Neutral: [], Positive: [] }
    );
  }

  static groupCityAnswers(answers) {
    return answers
      .sort((a, b) => a.answer.localeCompare(b.answer))
      .reduce((acc, item) => {
        const answer = BrazilianStates.normalize(item.answer);
        acc[answer] = acc[answer] ? acc[answer] + 1 : 1;
        return acc;
      }, []);
  }
}
