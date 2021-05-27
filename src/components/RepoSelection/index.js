import { Component } from "react";
import "./style.sass";
import axios from "axios";
import { withRouter } from "react-router-dom";
import Field from "../Field";
import Btn from "../Btn";
import { format } from "date-fns";
import toast, { Toaster } from "react-hot-toast";
import Modal from "../Modal";
import { Context } from "../../store";

class RepoSelection extends Component {
  static contextType = Context;
  constructor(props) {
    super(props);
    this.state = { repos: [], loading: false, disabled: true };
  }

  notify = (type, msg) => toast[type](msg);
  getHeaders = () => {
    let token = localStorage.getItem("token");
    return {
      Authorization: `token ${token}`,
      accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    };
  };
  click = () => {
    this.setState({ loading: true });
    axios
      .get(
        `https://api.github.com/repos/${this.state.repo}/contents/database`,
        {
          headers: this.getHeaders(),
        }
      )
      .then((res) => {
        const hasDatabase = res.data.find((i) => i.path === "database/.lyzeli");

        if (!hasDatabase) {
          this.createDatabase();
        } else {
          this.storeRepo();
        }
      })
      .catch((err) => {
        return this.createDatabase();
      });
  };

  storeRepo = () => {
    localStorage.setItem("repo", this.state.repo);
    window.location.reload();
  };

  createDatabase = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    return axios
      .put(
        `https://api.github.com/repos/${this.state.repo}/contents/database/.lyzeli`,
        {
          message: "Create database",
          content: Buffer.from(format(new Date(), "d-MM-Y HH:mm:ss")).toString(
            "base64"
          ),
          committer:
            user.name && user.email
              ? {
                  name: user.name,
                  email: user.email,
                }
              : {
                  name: "Lyzeli",
                  email: "example@email.com",
                },
          author:
            user.name && user.email
              ? {
                  name: user.name,
                  email: user.email,
                }
              : {
                  name: "Lyzeli",
                  email: "example@email.com",
                },
        },
        {
          headers: this.getHeaders(),
        }
      )
      .then((r) => {
        this.storeRepo();
      })
      .catch(() => {
        this.setState({ loading: false });
        this.notify("error", "This repo doesn't exist!");
      });
  };

  setRepo = (str) => {
    localStorage.removeItem("current");
    localStorage.removeItem("repo");
    localStorage.removeItem("name");
    localStorage.removeItem("database");

    const repo = str
      .replace("https://github.com/", "")
      .replace("https://www.github.com", "")
      .replace(".git", "");
    this.setState(
      {
        repo,
      },
      () => {
        this.setState({ disabled: false });
      }
    );
  };

  render() {
    return (
      <Modal
        indestructible={this.props.indestructible || false}
        top
        onClose={this.props.onClose}
      >
        <div className="c-repo-selection__body">
          <div>
            <h1 className="c-repo-selection__title">
              In which GitHub repo do you want to save Lyzeli's data?
            </h1>
            <p className="c-repo-selection__subtitle">
              Insert the repo full URL:
            </p>
            <Field
              placeholder="https://github.com/org/repo"
              onChange={(str) => this.setRepo(str)}
              sublabel="For security, give preference to private repositories."
            />
          </div>
          <Btn
            className="c-repo-selection__continue"
            color="positive"
            loading={this.state.loading}
            onClick={this.click}
            disabled={this.state.disabled}
          >
            Salvar e continuar
          </Btn>
          <Toaster
            position="bottom-center"
            toastOptions={{
              error: {
                style: {
                  background: "#e2aaaa",
                  fontWeight: 500,
                },
              },
            }}
          />
        </div>
      </Modal>
    );
  }
}
export default withRouter(RepoSelection);
