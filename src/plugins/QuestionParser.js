import BrazilianStates from "./BrazilianStates";

export default class QuestionParser {
  static agreement = [
    "concordo",
    "estou de acordo",
    "li e concordo",
    "li e estou de acordo",
    "concordo com os termos",
  ];

  static disagreement = ["não concordo", "não aceito"];

  static concordance = [
    "Sim",
    "Com certeza",
    "Aceito",
    "Concordo",
    "Confirmo",
    "Eu sei",
    "Acho que sim",
    "As vezes",
    "Sempre",
    "muitas vezes",
    "Raramente",
    "Conheço",
    "Conheco",
    "Com certeza",
    "Claro",
    "Sem dúvidas",
  ];
  static nonConcordance = [
    "Não",
    "Nunca",
    "Nao",
    "Nenhuma",
    "Nao conheço",
    "Não conheco",
    "Desconheço",
    "Desconheco",
    "Com certeza nao",
    "Especificamente nao",
    "Infelizmente nao",
    "De forma alguma",
    "De maneira nenhuma",
    "Jamais",
    "N/A",
    "----",
  ];

  static types = [
    {
      title: "Timestamp",
      key: "timestamp",
      somewhere: ["carimbo de data/hora"],
    },
    {
      title: "Terms And Conditions",
      key: "terms",
      somewhere: [
        "li e concordo",
        "li e estou de acordo",
        "concordo com os termos",
      ],
      answers: {
        options: {
          negative: {
            startsWith: this.disagreement,
          },
          positive: {
            startsWith: this.agreement,
          },
        },
      },
    },
    {
      title: "Yes or Not",
      key: "yesOrNot",
      somewhere: [
        "você já",
        "você tem",
        "você sabe",
        "você conhece",
        "você lida",
        "você utiliza",
      ],
      startsWith: ["É "],
      endsWith: [
        "discorra",
        "justifique",
        "justifique sua resposta",
        "é uma prática adotada no seu fluxo de trabalho?",
      ],
      answers: {
        options: {
          negative: {
            startsWith: this.nonConcordance,
          },
          positive: {
            startsWith: this.concordance,
          },
        },
      },
    },
    {
      title: "City/State",
      key: "cityState",
      startsWith: ["onde você", "qual a sua cidade", "qual a sua naturalidade"],
      somewhere: ["cidade/estado"],
    },
    {
      title: "NPS like",
      key: "npsLike",
      somewhere: ["escala de 1 a 10"],
      answers: {
        options: {
          positive: {
            endsWith: ["0", "9"],
          },
          negative: {
            endsWith: ["1", "2", "3", "4", "5", "6"],
          },
          neutral: {
            endsWith: ["8", "7"],
          },
        },
      },
    },
    {
      title: "Groups in answer",
      key: "groupsInAnswer",
      startsWith: [
        "onde você",
        "escolha",
        "Qual o seu nível de",
        "Há quanto tempo",
      ],
      endsWith: [":", "a seguir.", "a seguir:", "seguintes:", "seguintes."],
    },
    {
      title: "Negative or list",
      key: "negativeOrList",
      somewhere: ["Quais "],
      answers: {
        options: {
          negative: {
            startsWith: this.nonConcordance,
          },
        },
      },
    },
    {
      title: "Feedback",
      key: "feedback",
      somewhere: [
        "deixe feedback",
        "deixe um comentário",
        "comente",
        "comentários",
      ],
    },
    {
      title: "Open Question",
      key: "openQuestion",
    },
  ];

  static getTypes() {
    return this.types;
  }

  static getType(key) {
    return this.types.find((i) => i.key === key);
  }

  static normalizeStr(str) {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/,/g, "");
  }

  static predictType(question) {
    for (let i = 0; i < this.types.length; i++) {
      const type = this.types[i];
      let includes = null;

      includes = this.checkStartsWith(question, type.startsWith);
      if (!includes) {
        includes = this.checkEndsWith(question, type.endsWith);
      }

      if (!includes) {
        includes = this.checkSomewhere(question, type.somewhere);
      }

      if (includes) {
        return type;
      }
    }

    return this.types.find((i) => i.key === "openQuestion");
  }

  static checkStartsWith(text, options) {
    if (!(options && options.length)) {
      return false;
    }
    return options.find((item) =>
      this.normalizeStr(text).startsWith(this.normalizeStr(item))
    );
  }

  static checkEndsWith(text, options) {
    if (!(options && options.length)) {
      return false;
    }
    return options.find((item) =>
      this.normalizeStr(text).endsWith(this.normalizeStr(item))
    );
  }

  static checkSomewhere(text, options) {
    if (!(options && options.length)) {
      return false;
    }
    return options.find((item) =>
      this.normalizeStr(text).includes(this.normalizeStr(item))
    );
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
            ? "positive"
            : item?.sentment?.score < -1
            ? "negative"
            : "neutral";

        acc[opt] = [...acc[opt], item];
        return acc;
      },
      { negative: [], neutral: [], positive: [] }
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

  static classifieAnswersByPositiveOrNegative(typeKey, answers) {
    const type = this.types.find((i) => i.key === typeKey);

    const options = Object.keys(type.answers.options).reduce((acc, item) => {
      acc[item] = [];
      return acc;
    }, {});

    let unclassified = [...answers];

    answers.forEach((answer) => {
      const text = `${answer.answer}`.toLowerCase().trim();
      const optionsKeys = Object.keys(options);

      for (let i = 0; i < optionsKeys.length; i++) {
        if (
          this.checkStartsWith(
            text,
            type.answers.options[optionsKeys[i]].startsWith
          )
        ) {
          options[optionsKeys[i]].push(answer);
          unclassified = unclassified.filter((i) => i.line !== answer.line);
        } else if (
          this.checkEndsWith(
            text,
            type.answers.options[optionsKeys[i]].endsWith
          )
        ) {
          options[optionsKeys[i]].push(answer);
          unclassified = unclassified.filter((i) => i.line !== answer.line);
        } else if (
          this.checkSomewhere(
            text,
            type.answers.options[optionsKeys[i]].somewhere
          )
        ) {
          options[optionsKeys[i]].push(answer);
          unclassified = unclassified.filter((i) => i.line !== answer.line);
        }
      }
    });

    options.unclassified = unclassified;
    return options;
  }

  static npsClassifie(typeKey, answers) {
    const options = this.classifieAnswersByPositiveOrNegative(typeKey, answers);
    options.nps =
      options.positive.length -
      options.negative.length /
        (options.positive.length +
          options.negative.length +
          options.neutral.length || 1);
    return options;
  }
}
