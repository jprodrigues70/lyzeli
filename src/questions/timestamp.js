const timestamp = {
  title: "Timestamp",
  key: "timestamp",
  includes: {
    ptBr: [
      "carimbo de data/hora",
      "registro de data/hora",
      "data e hora",
      "data/hora",
    ],
    en: [
      "carimbo de data/hora",
      "registro de data/hora",
      "data e hora",
      "data/hora",
      "timestamp",
    ],
  },
  startsWith: { ptBr: ["timestamp"], en: ["timestamp"] },
  weight: 1,
  answers: {
    printStyle: "summarizeDates",
  },
};
export default timestamp;
