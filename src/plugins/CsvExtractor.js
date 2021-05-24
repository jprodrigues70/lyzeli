import QuestionClassifier from "./QuestionClassifier";

export default class CsvExtractor {
  rows = [];
  titles = [];
  constructor(raw) {
    const splitedRaw = raw.split(/\r?\n|\r/);
    this.titles = splitedRaw.shift().split(/\t/);
    this.rows = splitedRaw.map((row) => row.split(/\t/));
    const classifier = new QuestionClassifier();

    this.classifications = this.titles.map(
      (title) => classifier.predict(title).key
    );
  }

  persist() {
    let database = JSON.parse(localStorage.getItem("database"));

    database = {
      titles: this.titles,
      rows: this.rows,
      classifications: this.classifications,
      manualSettings: {},
    };

    localStorage.setItem("database", JSON.stringify(database));
  }

  static update(obj = null) {
    let database = JSON.parse(localStorage.getItem("database"));

    database = {
      titles: obj.titles,
      rows: obj.rows,
      classifications: obj.classifications,
      manualSettings: obj.manualSettings,
    };

    localStorage.setItem("database", JSON.stringify(database));
  }
}
