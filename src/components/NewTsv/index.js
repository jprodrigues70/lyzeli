import { Component, createRef } from "react";
import { withRouter } from "react-router-dom";
import CsvExtractor from "../../plugins/CsvExtractor";
import Field from "../Field";
import FileUpload from "../FileUpload";
import Modal from "../Modal";
import "./style.sass";
import axios from "axios";
import { format } from "date-fns";
import { Context } from "../../store";

import toast, { Toaster } from "react-hot-toast";

class NewTsv extends Component {
  static contextType = Context;
  state = {
    language: "ptBr",
    name: format(new Date(), "d-MM-Y HH:mm:ss"),
    loading: false,
  };

  form = createRef();

  openFile = ({ target }) => {
    this.setState({
      loading: true,
    });
    const reader = new FileReader();
    if (target.files && target.files.length) {
      reader.readAsText(target.files[0]);

      reader.onload = () => {
        const database = new CsvExtractor(reader.result, this.state.language);

        this.form.current.reset();
        this.createDataset(database).then(() => {
          setTimeout(() => {
            this.setState({ loading: false });
            this.props.onClose();
          }, 700);
        });
      };
    }

    return;
  };

  getHeaders = () => {
    let token = localStorage.getItem("token");
    return {
      Authorization: `token ${token}`,
      accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    };
  };

  createDataset = (database) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const repo = localStorage.getItem("repo");

    return axios
      .put(
        `https://api.github.com/repos/${repo}/contents/database/${this.state.name}.json`,
        {
          message: "Create " + this.state.name,
          content: Buffer.from(JSON.stringify(database)).toString("base64"),
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

  setLanguage = ({ target }) => {
    this.setState({
      language: target.value,
    });
  };

  setName = (value) => {
    this.setState({
      name: value,
    });
  };

  notify = (type, msg) => toast[type](msg);

  render() {
    return (
      <Modal title="Import new dataset" small onClose={this.props.onClose}>
        <div className="c-new-tsv">
          <p>
            If you are using Google Forms, you can{" "}
            <a
              href="https://support.google.com/merchants/answer/160569?hl=pt-BR"
              target="_blank"
              rel="noreferrer"
            >
              see here how to export your spreadsheet to .tsv.
            </a>
          </p>
          <Field
            label="Insert a name for this dataset"
            modelValue={"Dataset " + format(new Date(), "d-MM-Y HH:mm:ss")}
            onChange={this.setName}
          />
          <span>The questions are in which language?</span>
          <label className="c-new-tsv__radio">
            <input
              type="radio"
              name="language"
              defaultChecked
              onChange={this.setLanguage}
              value="ptBr"
            />
            Portuguese
          </label>
          <label className="c-new-tsv__radio">
            <input
              type="radio"
              name="language"
              onChange={this.setLanguage}
              value="en"
            />
            English
          </label>
          <form ref={this.form}>
            <span>Select a .tsv file:</span>
            <FileUpload onChange={this.openFile} loading={this.state.loading} />
          </form>
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
          ;
        </div>
      </Modal>
    );
  }
}
export default withRouter(NewTsv);
