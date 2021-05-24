import { Component, createRef } from "react";
import { Context } from "../../store";
import CsvExtractor from "../../plugins/CsvExtractor";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { ReactComponent as Li } from "../../assets/li.svg";
import { ReactComponent as Settings } from "../../assets/settings.svg";
import { ReactComponent as Menu } from "../../assets/menu.svg";
import { ReactComponent as Logout } from "../../assets/log-out.svg";

import "./style.sass";
import Btn from "../Btn";
import Modal from "../Modal";
import VerticalNav from "../VerticalNav";

class Header extends Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = { database: {}, user: {}, showModal: false };
    this.form = createRef();
  }

  componentDidMount() {
    const token = localStorage.getItem("token");

    axios
      .get(`https://api.github.com/user`, {
        headers: {
          Authorization: `token ${token}`,
        },
      })
      .then((res) => {
        const user = res.data;
        localStorage.setItem("user", JSON.stringify(user));
        this.setState({ user });
      })
      .catch(() => {
        this.props.history.push("/");
      });
  }

  logout = () => {
    localStorage.clear();
    this.props.history.push("/");
  };

  toggleModal = () => {
    this.setState({
      showModal: !this.state.showModal,
    });
  };

  render() {
    return (
      <header className={`c-header ${this.props.className || ""}`}>
        <div className="c-header__left">
          <Btn
            className="v--bg-white"
            outline
            small
            onClick={() => this.toggleModal()}
          >
            <Menu />
          </Btn>
          {this.state.showModal ? (
            <Modal title="Menu" onClose={() => this.toggleModal()} small>
              <VerticalNav />
            </Modal>
          ) : null}
          <Li className="c-header__logo" />
        </div>
        <div className="c-header__right">
          <Btn className="v--bg-white" outline two-columns>
            <Settings />
            Settings
          </Btn>
          <Btn
            className="v--bg-white"
            outline
            two-columns
            onClick={() => this.logout()}
          >
            <Logout />
            Logout
          </Btn>
          <img
            className="c-header__avatar"
            src={this.state.user.avatar_url}
            alt={this.state.user.name}
          />
          {/* <a
            className="github-button"
            href="https://github.com/jprodrigues70/tsv-explorer"
            data-color-scheme="no-preference: dark; light: dark; dark: dark;"
            data-icon="octicon-star"
            data-size="large"
            data-show-count="true"
            aria-label="Star jprodrigues70/tsv-explorer on GitHub"
          >
            Star
          </a>
          <a
            className="github-button"
            href="https://github.com/jprodrigues70/tsv-explorer/fork"
            data-color-scheme="no-preference: dark; light: dark; dark: dark;"
            data-icon="octicon-repo-forked"
            data-size="large"
            aria-label="Fork jprodrigues70/tsv-explorer on GitHub"
          >
            Fork
          </a>
          <a
            className="github-button"
            href="https://github.com/jprodrigues70/tsv-explorer/issues"
            data-color-scheme="no-preference: dark; light: dark; dark: dark;"
            data-icon="octicon-issue-opened"
            data-size="large"
            aria-label="Issue jprodrigues70/tsv-explorer on GitHub"
          >
            Issue
          </a> */}
        </div>
      </header>
    );
  }
}
export default withRouter(Header);
