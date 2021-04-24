const nps = {
  title: "NPS like",
  key: "npsLike",
  includes: ["escala de 1 a 10"],
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
  weight: 1,
};
export default nps;
