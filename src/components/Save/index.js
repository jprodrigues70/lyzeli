import { Component } from "react";
import Btn from "../Btn";
import "./style.sass";
import { ParallelContext } from "../../parallelStore";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default class Save extends Component {
  static contextType = ParallelContext;
  state = {
    loading: false,
  };
  save = () => {
    this.setState({
      loading: true,
    });
    this.updateDataset()
      .then(() => {
        this.notify("success", "Changes saved");
        this.context.dispatch({
          action: "change.setTo",
          payload: 0,
        });
      })
      .catch(() => {
        this.notify("error", "Error! Please, try again");
      })
      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  };

  notify = (type, msg) => toast[type](msg);

  getHeaders = () => {
    let token = localStorage.getItem("token");
    return {
      Authorization: `token ${token}`,
      accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    };
  };

  updateDataset = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const repo = localStorage.getItem("repo");
    const current = localStorage.getItem("current");
    const database = localStorage.getItem("database");
    const name = localStorage.getItem("name");
    return axios
      .put(
        `https://api.github.com/repos/${repo}/contents/database/${name}.json`,
        {
          message: "Update " + name,
          content: Buffer.from(database).toString("base64"),
          sha: current,
          committer: {
            name: user.name,
            email: user.email,
          },
          author: {
            name: user.name,
            email: user.email,
          },
        },
        {
          headers: this.getHeaders(),
        }
      )
      .then((res) => {
        localStorage.setItem("current", res.data.content.sha);
      })
      .catch(() => {
        this.setState({ loading: false });
        this.notify("error", "This repo doesn't exist!");
      });
  };

  render() {
    const text =
      this.context.state["change.count"] === 1 ? "change" : "changes";
    return (
      <>
        {(this.context.state["change.count"] && (
          <div className="c-save">
            <div className="c-save__body">
              {this.context.state["change.count"]} unsaved {text}
              <Btn
                color="positive"
                onClick={this.save}
                loading={this.state.loading}
              >
                SAVE
              </Btn>
            </div>
          </div>
        )) ||
          ""}
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
      </>
    );
  }
}
