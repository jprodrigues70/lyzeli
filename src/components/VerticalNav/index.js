import { Component } from "react";
import "./style.sass";
import { Context } from "../../store";
import Btn from "../Btn";

import Modal from "../Modal";
import Field from "../Field";
export default class VerticalNav extends Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
    };
  }

  toggleModal = () => {
    console.log("OPA");
    this.setState({
      showModal: !this.state.showModal,
    });
  };

  change(key) {
    const local = JSON.parse(localStorage.getItem("database"));

    if (!key || !local) {
      return;
    }

    const database = local[key];
    const { dispatch } = this.context;

    dispatch({ action: "database.create", payload: database });
    dispatch({ action: "database.setKey", payload: key });
  }

  render() {
    return (
      <nav className={`c-vertical-nav ${this.props.className || ""}`}>
        {this.state.showModal ? (
          <Modal title="Login" onClose={() => this.toggleModal()} small>
            <Field label="Insira o seu token do GitHub"></Field>
            <Field label="Qual o repositório?"></Field>
            <p>
              <small>
                O token ficará gravado localmente, para que você não precise
                voltar no GitHub quando quiser usar a plataforma novamente.
                Sendo assim, lembre-se de sair, caso esteja em um computador que
                não confia.
              </small>
            </p>
            <div style={{ margin: "8px 0" }}>
              <Btn>ENTRAR E SALVAR</Btn>
            </div>
            <p>
              <small>
                Para criar um token no GitHub, basta acessar
                <a href="https://github.com/settings/tokens">
                  https://github.com/settings/tokens
                </a>
                . Dê todas as permissões do tipo "repo", e a opção "read:user".
              </small>
            </p>
          </Modal>
        ) : null}
        <div className="c-vertical-nav__header">TSV Data</div>
        <div className="c-vertical-nav__body">
          <p>You .tsv files:</p>
          {this.props.items.length ? (
            <ul className="c-vertical-nav__list">
              {this.props.items.map((item) => {
                return (
                  <li
                    className="c-vertical-nav__list-item"
                    key={item.key}
                    onClick={() => this.change(item.value)}
                  >
                    {item.name}
                  </li>
                );
              })}
            </ul>
          ) : (
            "You need to import some file"
          )}
        </div>
        <div className="c-vertical-nav__footer">
          {/* <Btn onClick={() => this.toggleModal()}>Salvar no GitHub</Btn> */}
        </div>
      </nav>
    );
  }
}
