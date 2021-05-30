export default class Arr {
  static unique(arr, key) {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
  }

  static intersection(arr1, arr2, key) {
    return arr1.filter(
      (item) => !arr2.some((item2) => item2[key] === item[key])
    );
  }
}
