const cityState = {
  title: "City/State",
  key: "cityState",
  startsWith: {
    ptBr: ["onde você", "qual a sua cidade", "qual a sua naturalidade"],
    en: ["where"],
  },
  includes: { ptBr: ["cidade/estado"], en: ["city/state"] },
  weight: 1,
  answers: {
    printStyle: "summarizeCityState",
  },
};
export default cityState;
