import negatives from "../phrases/negatives";

const negativeOrList = {
  title: "Negative or list",
  key: "negativeOrList",
  includes: [
    "quais ",
    "sua opinião",
    "opine",
    "você sugere",
    "você acha",
    "justifique",
    "você considera",
    "você concorda",
    "você está de acordo",
  ],
  answers: {
    options: {
      negative: {
        startsWith: negatives,
      },
    },
  },
  weight: 20,
};
export default negativeOrList;
