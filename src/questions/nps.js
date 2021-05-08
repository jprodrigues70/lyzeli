const nps = {
  title: "NPS like",
  key: "npsLike",
  includes: { ptBr: ["escala de 1 a 10"], en: ["scale of 1 to 10"] },
  answers: {
    classification: {
      positive: {
        endsWith: { ptBr: ["0", "9"], en: ["0", "9"] },
      },
      negative: {
        endsWith: {
          ptBr: ["1", "2", "3", "4", "5", "6"],
          en: ["1", "2", "3", "4", "5", "6"],
        },
      },
      neutral: {
        endsWith: { ptBr: ["8", "7"], en: ["8", "7"] },
      },
    },
    printStyle: "categorizeAndMerge",
  },
  weight: 1,
};
export default nps;
