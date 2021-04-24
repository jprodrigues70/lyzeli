import negatives from "../phrases/negatives";
import positives from "../phrases/positives";

const terms = {
  title: "Terms And Conditions",
  key: "terms",
  includes: [
    "aceitar participar",
    "aceito participar",
    "concordar e continuar",
    "concordo com os termos",
    "concordo em continuar",
    "li e concordo",
    "li e estou de acordo",
    "termos de uso",
    "termos e condições",
    "de acordo com nossos termos",
    "de acordo com os termos",
  ],
  answers: {
    options: {
      negative: {
        startsWith: negatives,
      },
      positive: {
        startsWith: positives,
      },
    },
  },
  weight: 1,
};
export default terms;
