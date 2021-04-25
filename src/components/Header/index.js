import { Component, createRef } from "react";
import FileUpload from "../FileUpload";
import { Context } from "../../store";
import CsvExtractor from "../../plugins/CsvExtractor";
import "./style.sass";

export default class Header extends Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = { database: {} };
    this.form = createRef();
  }

  openFile = ({ target }) => {
    const reader = new FileReader();
    if (target.files && target.files.length) {
      reader.readAsText(target.files[0]);

      reader.onload = () => {
        const database = new CsvExtractor(reader.result);
        const key = database.persist();
        const { dispatch } = this.context;
        dispatch({ action: "database.create", payload: database });

        const keys = JSON.parse(localStorage.getItem("database")) || {};

        dispatch({
          action: "database.setKeys",
          payload: [...Object.keys(keys)],
        });

        dispatch({ action: "database.setKey", payload: key });
        this.form.current.reset();
      };
    }

    return;
  };

  render() {
    return (
      <header className={`c-header ${this.props.className || ""}`}>
        <form ref={this.form}>
          <FileUpload onChange={(event) => this.openFile(event)} />
        </form>
        <div className="c-header__right">
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
        </div>
      </header>
    );
  }
}
