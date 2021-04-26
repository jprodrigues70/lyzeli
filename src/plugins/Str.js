export default class Str {
  static normalize(text) {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/gi, "")
      .replace(/,/gi, "")
      .replace(/[“”`~!@#$%^&*()|+=?;:'",.<>{}[\]/]/gi, "")
      .replace(/^-/gi, "")
      .replace(/\./gi, "");
  }

  static normalizeAndRemoveNumbers(text, regex = /^\d+/g) {
    return this.normalize(text)
      .replace(regex, "")
      .replace(/^[^a-zA-Z]+/gi, "")
      .replace(/^\./gi, "")
      .replace(/^\-/gi, "")
      .replace(/^\_/gi, "")
      .replace(/^\s+/g, "");
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

    return options.find((item) =>
      this[normalizer](text).trim()[type](this[normalizer](item))
    );
  }

  static ucfirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
