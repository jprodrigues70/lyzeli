import negatives from "../phrases/negatives";
import positives from "../phrases/positives";

const yesOrNot = {
  title: "Yes or Not",
  key: "yesOrNot",
  includes: {
    ptBr: [
      "você já",
      "você tem",
      "você sabe",
      "você conhece",
      "você lida",
      "você utiliza",
      "você aprendeu",
      "você lembra",
      "gostaria de",
      "Se sim",
      "Se não",
      "Se positivo",
      "Se negativo",
      "Se afirmativo",
      "Caso sim",
      "Caso não",
      "Caso positivo",
      "Caso negativo",
      "Caso afirmativo",
    ],
    en: ["how often"],
  },
  startsWith: { ptBr: ["É ", "Há"], en: ["There are"] },
  endsWith: {
    ptBr: [
      "discorra",
      "justifique",
      "justifique sua resposta",
      "é uma prática adotada no seu fluxo de trabalho?",
      "explique",
    ],
    en: ["please detail"],
  },
  answers: {
    classification: {
      negative: {
        startsWith: negatives,
      },
      positive: {
        startsWith: positives,
      },
    },
    printStyle: "categorizeAndMerge",
  },
  weight: 10,
};
export default yesOrNot;
