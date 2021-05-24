import { Component } from "react";
import "./style.sass";
import { Context } from "../../store";

import FileUpload from "../FileUpload";
import Modal from "../Modal";

import axios from "axios";
// import { ReactComponent as Remove } from "../../assets/close.svg";
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
    };
  }

  state = {
    loading: true,
    items: [],
  };

  componentDidMount() {
    const repo = localStorage.getItem("repo");

    if (repo) {
      axios
        .get(`https://api.github.com/repos/${repo}/contents/database`, {
          headers,
        })
        .then((res) => {
          const hasDatabase = res.data.find(
            (i) => i.path === "database/.lyzeli"
          );
          if (hasDatabase) {
            this.setState({
              items: res.data.filter(
                (i) =>
                  i.path !== "database/.lyzeli" &&
                  i.path.startsWith("database/")
              ),
            });
            const current = localStorage.getItem("current");
            const sha =
              !current && this.state.items.length
                ? this.state.items[0].sha
                : current;

            if (sha) {
              this.getDatabase(sha);
            }
          }
        });
    }
  }

  getDatabase(sha) {
    this.setState({ loading: true });
    this.props.onLoadChange && this.props.onLoadChange(this.state.loading);
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
        this.props.onLoadChange && this.props.onLoadChange(this.state.loading);
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
    this.props.onChange(item.sha);
  };

  render() {
    return (
      <nav className={`c-vertical-nav ${this.props.className || ""}`}>
        <div className="c-vertical-nav__header">
          <Logo />
        </div>
        <div className="c-vertical-nav__body">
          <NewTsv />
          <Btn block className="v--bg-dark">
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
                    {/* <span
                      className="c-vertical-nav__list-item__close"
                      onClick={(event) => this.remove(event, item)}
                    >
                      <Remove></Remove>
                    </span> */}
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
