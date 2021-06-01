const groupsInAnswer = {
  title: "Groups in answer",
  key: "groupsInAnswer",
  startsWith: {
    ptBr: [
      "onde você",
      "escolha",
      "Qual o seu nível de",
      "Há quanto tempo",
      "em qual",
      "quantos anos",
      "o quanto você",
      "quais tipos",
    ],
    en: ["how often", "have you ever"],
  },
  includes: {
    ptBr: [
      "quanto tempo",
      "quantos anos",
      "o quanto ",
      "quanto ao",
      "quanto à",
      "a seguir",
      "que seguem",
      "quantos",
      "quantas",
      "quanto(a)s",
      "quanta(o)s",
      "indicar mais de uma",
    ],
    en: ["how long", "what is", "what title"],
  },
  endsWith: {
    ptBr: [":", "a seguir.", "a seguir:", "seguintes:", "seguintes."],
    en: [":", "follows"],
  },
  weight: 9,
  answers: {
    printStyle: "summarize",
    showChart: "Dognut",
  },
};
export default groupsInAnswer;
