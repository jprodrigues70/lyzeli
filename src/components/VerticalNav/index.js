import { Component } from "react";
import "./style.sass";
import { Context } from "../../store";
import Btn from "../Btn";

import Modal from "../Modal";
import Field from "../Field";
import { ReactComponent as Remove } from "../../assets/close.svg";

export default class VerticalNav extends Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
    };
  }

  remove = (event, item) => {
    event.stopPropagation();
    const { dispatch, state } = this.context;

    const keys = state["database.keys"].filter(
      (i) => parseInt(i) !== parseInt(item.value)
    );

    dispatch({ action: "database.remove", payload: item.value });

    if (this.context.state["database.key"] === item.value) {
      if (keys.length) {
        const position = keys.length - 1;
        const key = keys[position];
        this.change(key);
      } else {
        dispatch({ action: "database.create", payload: {} });
        dispatch({ action: "database.setKey", payload: "" });
      }
    }
  };

  toggleModal = () => {
    this.setState({
      showModal: !this.state.showModal,
    });
  };

  isActive = (item) => {
    return (
      parseInt(item.value) === parseInt(this.context.state["database.key"])
    );
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
              {this.props.items.reverse().map((item) => {
                return (
                  <li
                    className={`c-vertical-nav__list-item ${
                      this.isActive(item) && `c-vertical-nav__list-item--active`
                    }`}
                    key={item.key}
                    onClick={() => this.change(item.value)}
                  >
                    <span>{item.name}</span>
                    <span
                      className="c-vertical-nav__list-item__close"
                      onClick={(event) => this.remove(event, item)}
                    >
                      <Remove></Remove>
                    </span>
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
