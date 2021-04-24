const nps = {
  title: "NPS like",
  key: "npsLike",
  includes: ["escala de 1 a 10"],
  answers: {
    classification: {
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
    printStyle: "categorizeAndMerge",
  },
  weight: 1,
};
export default nps;
