import QuestionClassifier from "./questionClassifier";

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
    const key = new Date().getTime();
    database = {
      ...database,
      [key]: {
        titles: this.titles,
        rows: this.rows,
        classifications: this.classifications,
      },
    };
    localStorage.setItem("database", JSON.stringify(database));
    return key;
  }

  static update(key = null, obj = null) {
    let database = JSON.parse(localStorage.getItem("database"));

    database = {
      ...database,
      [key]: {
        titles: obj.titles,
        rows: obj.rows,
        classifications: obj.classifications,
      },
    };
    localStorage.setItem("database", JSON.stringify(database));
  }
}
