export default class Str {
  static normalize(text) {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/,/g, "")
      .replace(/\./g, "");
  }

  static normalizeAndRemoveNumbers(text) {
    return this.normalize(text).replace(/^\d+/g, "").replace(/^\s+/g, "");
  }

  static finder(type, text, options, removeNumbers) {
    if (!(options && options.length)) {
      return false;
    }
    const normalizer = removeNumbers
      ? "normalizeAndRemoveNumbers"
      : "normalize";

    return options.find((item) =>
      this[normalizer](text).trim()[type](this[normalizer](item))
    );
  }
}
