export default class Arr {
  static unique(arr, key) {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
  }
}
