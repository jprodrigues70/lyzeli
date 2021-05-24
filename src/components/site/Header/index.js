import { Component } from "react";
import { ReactComponent as Logo } from "../../../assets/Lyzeli.svg";
import LoginGithub from "react-login-github";
import { withRouter } from "react-router-dom";

import axios from "axios";

import "./style.sass";
import LoadingLogin from "../../LoadingLogin";

class Header extends Component {
  state = {
    loading: false,
  };
  onSuccess = async ({ code }) => {
    this.setState({ loading: true });
    const res = await axios.post(`https://lyzeli.herokuapp.com/`, { code });
    if (res && res.data && res.data.access_token) {
      localStorage.setItem("token", res.data.access_token);
      setTimeout(() => {
        this.setState({ loading: false });
        return this.props.history.push("/painel");
      }, 600);
    }
    this.setState({ loading: false });
    return false;
  };
  onFailure = (response) => localStorage.clear();

  render() {
    return (
      <header className="c-site-header">
        <Logo />
        <div>
          <LoginGithub
            className="c-btn v--bg-dark"
            clientId="7b0136a2fb506dacb217"
            onSuccess={this.onSuccess}
            scope="repo,read:user"
            onFailure={this.onFailure}
          />
        </div>
        {/* <div className="c-header__right">
          <a
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
          </a>
        </div> */}
        {this.state.loading && <LoadingLogin />}
      </header>
    );
  }
}

export default withRouter(Header);
