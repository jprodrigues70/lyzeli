import { Component } from "react";
import { Context } from "../../store";
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
import { ParallelContext } from "../../parallelStore";
import RepoSelection from "../RepoSelection";

class Header extends Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = {
      database: {},
      user: {},
      showNavModal: false,
      showSettingsModal: false,
    };
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

  toggleNavModal = () => {
    this.setState({
      showNavModal: !this.state.showNavModal,
    });
  };

  toggleSettingsModal = () => {
    console.log("EOA");
    this.setState({
      showSettingsModal: !this.state.showSettingsModal,
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
            onClick={this.toggleNavModal}
          >
            <Menu />
          </Btn>
          {this.state.showNavModal ? (
            <Modal title="Menu" onClose={this.toggleNavModal} small>
              <ParallelContext.Consumer>
                {(parallel) => (
                  <VerticalNav
                    onChange={this.toggleNavModal}
                    parallel={parallel}
                  />
                )}
              </ParallelContext.Consumer>
            </Modal>
          ) : null}
          <Li className="c-header__logo" />
        </div>
        <div className="c-header__right">
          {this.state.showSettingsModal && (
            <RepoSelection indestructible onClose={this.toggleSettingsModal} />
          )}
          <Btn
            className="v--bg-white"
            outline
            two-columns
            onClick={this.toggleSettingsModal}
          >
            <Settings />
            Settings
          </Btn>
          <Btn
            className="v--bg-white"
            outline
            two-columns
            onClick={this.logout}
          >
            <Logout />
            Logout
          </Btn>
          <img
            className="c-header__avatar"
            src={this.state.user.avatar_url}
            alt={this.state.user.name}
          />
        </div>
      </header>
    );
  }
}
export default withRouter(Header);
