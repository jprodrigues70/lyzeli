import negatives from "../phrases/negatives";

const negativeOrList = {
  title: "Negative or list",
  key: "negativeOrList",
  includes: {
    ptBr: [
      "quais ",
      "sua opinião",
      "opine",
      "você sugere",
      "você acha",
      "justifique",
      "você considera",
      "você concorda",
      "você está de acordo",
      "avalie",
      "qual motivo",
      "como você avalia",
    ],
    en: ["what action", "what", "please detail"],
  },
  answers: {
    alias: {
      unclassified: "Others",
    },
    classification: {
      negative: {
        startsWith: negatives,
      },
    },
    printStyle: "categorize",
    wordCloud: true,
  },
  weight: 20,
};
export default negativeOrList;
