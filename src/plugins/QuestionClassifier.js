import Files from "./Files";
import Str from "./Str";

export default class QuestionClassifier {
  constructor(language) {
    const raw = require.context(`../questions`, true, /.*\.(js)$/);
    this.options = Files.getComponents(raw).map(
      (component) => component.default
    );
    this.language = language;
  }

  getOption(key) {
    return this.options.find((item) => item.key === key);
  }

  predict(question) {
    const options = this.options.sort((a, b) => a.weight - b.weight);

    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      const positions = ["startsWith", "endsWith", "includes"].filter(
        (i) => option[i]
      );

      for (let j = 0; j < positions.length; j++) {
        if (
          Str.finder(
            positions[j],
            question,
            option[positions[j]][this.language],
            true
          )
        ) {
          return option;
        }
      }
    }

    return options[options.length - 1];
  }
}
