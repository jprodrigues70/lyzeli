import { Component } from "react";
import "./style.sass";
import { Context } from "../../store";

import axios from "axios";

import { ReactComponent as Logo } from "../../assets/Lyzeli.svg";
import { ReactComponent as Db } from "../../assets/database.svg";
import Btn from "../Btn";
import NewTsv from "../NewTsv";

let token = localStorage.getItem("token");

const headers = {
  Authorization: `token ${token}`,
  accept: "application/vnd.github.v3+json",
  "Content-Type": "application/json",
};
export default class VerticalNav extends Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      items: [],
      current: localStorage.getItem("current"),
      showImportModal: false,
    };
  }

  state = {
    loading: true,
    items: [],
  };

  loadMenu = () => {
    const repo = localStorage.getItem("repo");

    if (repo) {
      axios
        .get(
          `https://api.github.com/repos/${repo}/contents/database?timestamp=${new Date().getTime()}`,
          {
            headers,
          }
        )
        .then((res) => {
          const hasDatabase = res.data.find(
            (i) => i.path === "database/.lyzeli"
          );
          if (hasDatabase) {
            this.setState(
              {
                items: res.data.filter(
                  (i) =>
                    i.path !== "database/.lyzeli" &&
                    i.path.startsWith("database/")
                ),
              },
              () => {
                const current = localStorage.getItem("current");
                const sha =
                  !current && this.state.items.length
                    ? this.state.items[0].sha
                    : current;

                if (sha && this.state.items.length) {
                  this.getDatabase(sha);
                } else {
                  localStorage.setItem("current", "");
                  this.props.onLoadChange && this.props.onLoadChange(false);
                }
              }
            );
          }
        });
    }
  };

  componentDidMount() {
    this.loadMenu();
  }

  componentDidUpdate() {
    const current = localStorage.getItem("current");
    if (this.state.current !== current) {
      console.log("yes, yes");
      this.setState({ current });
      this.loadMenu();
    }
  }

  getDatabase(sha) {
    this.setState({ loading: true });
    this.props.onLoadChange && this.props.onLoadChange(true);
    const repo = localStorage.getItem("repo");
    axios
      .get(`https://api.github.com/repos/${repo}/git/blobs/${sha}`, {
        headers,
      })
      .then((res) => {
        const str = Buffer.from(res.data.content, "base64").toString("utf8");
        const database = JSON.parse(str);

        localStorage.setItem("database", JSON.stringify(database));
        localStorage.setItem("current", sha);

        this.context.dispatch({
          action: "database.create",
          payload: database,
        });
      })
      .finally(() => {
        this.setState({ loading: false });
        this.props.onLoadChange && this.props.onLoadChange(false);
      });
  }

  toggleModal = () => {
    this.setState({
      showModal: !this.state.showModal,
    });
  };

  isActive = (item) => {
    return item.sha === this.state.current;
  };

  change = (item) => {
    this.setState({
      current: item.sha,
    });
    this.getDatabase(item.sha);
  };

  closeImportModal = () => {
    this.setState({
      showImportModal: false,
    });
  };

  openImportModal = () => {
    this.setState({
      showImportModal: true,
    });
  };

  render() {
    return (
      <nav className={`c-vertical-nav ${this.props.className || ""}`}>
        <div className="c-vertical-nav__header">
          <Logo />
        </div>
        <div className="c-vertical-nav__body">
          {(this.state.showImportModal && (
            <NewTsv onClose={this.closeImportModal} />
          )) ||
            null}
          <Btn block className="v--bg-dark" onClick={this.openImportModal}>
            IMPORT NEW DATASET
          </Btn>
          {this.state.items.length ? (
            <ul className="c-vertical-nav__list">
              {this.state.items.reverse().map((item) => {
                return (
                  <li
                    className={`c-vertical-nav__list-item ${
                      this.isActive(item) && `c-vertical-nav__list-item--active`
                    }`}
                    key={item.path}
                    onClick={() => this.change(item)}
                  >
                    <Db />
                    <span>{item.name.replace(".json", "")}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            "You need to import some file"
          )}
        </div>
        <div className="c-vertical-nav__footer"></div>
      </nav>
    );
  }
}
