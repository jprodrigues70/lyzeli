import QuestionClassifier from "./QuestionClassifier";

export default class CsvExtractor {
  rows = [];
  titles = [];
  constructor(raw, language) {
    const splitedRaw = raw.split(/\r?\n|\r/);
    this.titles = splitedRaw.shift().split(/\t/);
    this.rows = splitedRaw.map((row) => row.split(/\t/));
    const classifier = new QuestionClassifier(language);
    this.language = language;
    this.classifications = this.titles.map(
      (title) => classifier.predict(title).key
    );
  }

  persist() {
    let database = JSON.parse(localStorage.getItem("database"));

    database = {
      language: this.language,
      titles: this.titles,
      rows: this.rows,
      classifications: this.classifications,
      manualSettings: {},
      comments: {},
    };

    localStorage.setItem("database", JSON.stringify(database));
  }

  static update(obj = null) {
    let database = JSON.parse(localStorage.getItem("database"));

    database = {
      language: obj.language,
      titles: obj.titles,
      rows: obj.rows,
      classifications: obj.classifications,
      manualSettings: obj.manualSettings,
      comments: obj.comments,
    };

    localStorage.setItem("database", JSON.stringify(database));
  }
}
