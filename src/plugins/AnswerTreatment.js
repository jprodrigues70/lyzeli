import BrazilianStates from "./BrazilianStates";

export default class AnswerTreatment {
  static timestamp(str) {
    return str.split(" ")[0];
  }

  static cityState(str) {
    return BrazilianStates.normalize(str);
  }
}
