export default class Str {
  static normalize(text) {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/gi, "")
      .replace(/,/g, "")
      .replace(/[“”]/g, "")
      .replace(/\(/g, "")
      .replace(/\)/g, "")
      .replace(/^-/g, "")
      .replace(/\./g, "");
  }

  static normalizeAndRemoveNumbers(text, regex = /^\d+/g) {
    return this.normalize(text)
      .replace(regex, "")
      .replace(/^\./g, "")
      .replace(/^-/g, "")
      .replace(/^_/g, "")
      .trim();
  }

  static normalizeAndRemoveAllNumbers(text) {
    return Str.normalizeAndRemoveNumbers(text, /\d+/g);
  }

  static finder(type, text, options, removeNumbers) {
    if (!(options && options.length)) {
      return false;
    }
    const normalizer = removeNumbers
      ? "normalizeAndRemoveNumbers"
      : "normalize";
    const found = options.find((item) =>
      this[normalizer](text).trim()[type](this[normalizer](item))
    );

    return found;
  }

  static ucfirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
