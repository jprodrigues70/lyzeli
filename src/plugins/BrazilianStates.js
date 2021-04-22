export default class BrazilianStates {
  static states = {
    Acre: "AC",
    Alagoas: "AL",
    Amapá: "AP",
    Amazonas: "AM",
    Bahia: "BA",
    Ceará: "CE",
    DistritoFederal: "DF",
    EspíritoSanto: "ES",
    Goiás: "GO",
    Maranhão: "MA",
    MatoGrosso: "MT",
    MatoGrossodoSul: "MS",
    MinasGerais: "MG",
    Pará: "PA",
    Paraíba: "PB",
    Paraná: "PR",
    Pernambuco: "PE",
    Piauí: "PI",
    RiodeJaneiro: "RJ",
    RioGrandedoNorte: "RN",
    RioGrandedoSul: "RS",
    Rondônia: "RO",
    Roraima: "RR",
    SantaCatarina: "SC",
    SãoPaulo: "SP",
    Sergipe: "SE",
    Tocantins: "TO",
  };

  static normalize(str) {
    let output = str
      .replace(/\s/g, "")
      .replace(/,/g, "/")
      .replace(/\(/g, "/")
      .replace(/\)/g, "")
      .replace(/-/g, "/")
      .replace(/\./g, "");

    Object.keys(this.states).forEach((state) => {
      output = output.replace(
        `${this.states[state]}`,
        `/${this.states[state]}`
      );
      output = output.replace(`/${state}`, `/${this.states[state]}`);
      output = output.replace(`//`, `/`);
    });

    return output;
  }
}
