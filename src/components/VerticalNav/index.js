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
      currentName: localStorage.getItem("name"),
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
                const currentName = localStorage.getItem("name");
                const item =
                  !currentName && this.state.items.length
                    ? this.state.items[0]
                    : this.state.items.find(
                        (i) => i.name === `${currentName}.json`
                      ) || {};
                const sha = item.sha;

                if (sha && this.state.items.length) {
                  localStorage.setItem("name", item.name.replace(".json", ""));
                  this.getDatabase(sha);
                } else {
                  localStorage.setItem("name", "");
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
    const currentName = localStorage.getItem("name");
    if (this.state.currentName !== currentName) {
      this.setState({ currentName });
      this.loadMenu();
    }
  }

  getDatabase(sha) {
    this.setState({ loading: true });
    this.props.onLoadChange && this.props.onLoadChange(true);
    const repo = localStorage.getItem("repo");
    axios
      .get(
        `https://api.github.com/repos/${repo}/git/blobs/${sha}?timestamp=${new Date().getTime()}`,
        {
          headers,
        }
      )
      .then((res) => {
        const str = Buffer.from(res.data.content, "base64").toString("utf8");
        const database = JSON.parse(str);

        localStorage.removeItem("database");
        localStorage.setItem("database", JSON.stringify(database));

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
    if (item.name.replace(".json", "") === this.state.currentName) {
      localStorage.setItem("name", item.name.replace(".json", ""));
      return true;
    }
    return false;
  };

  change = (item) => {
    this.setState({
      currentName: item.name.replace(".json", ""),
    });
    localStorage.setItem("name", item.name.replace(".json", ""));

    this.props.parallel.dispatch({
      action: "change.setTo",
      payload: 0,
    });

    this.getDatabase(item.sha);

    if (this.props.onChange) {
      this.props.onChange(item);
    }
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
