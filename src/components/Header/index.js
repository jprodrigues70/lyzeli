import { Component } from "react";
import FileUpload from "../FileUpload";
import { Context } from "../../store";
import CsvExtractor from "../../plugins/CsvExtractor";
import "./style.sass";

export default class Header extends Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = { database: {} };
  }

  openFile = ({ target }) => {
    const reader = new FileReader();
    reader.readAsText(target.files[0]);

    reader.onload = () => {
      const database = new CsvExtractor(reader.result);
      const key = database.persist();
      const { dispatch } = this.context;
      dispatch({ action: "database.create", payload: database });
      dispatch({ action: "database.setKey", payload: key });

      const keys = JSON.parse(localStorage.getItem("database")) || {};

      dispatch({
        action: "database.setKeys",
        payload: [...Object.keys(keys)],
      });
    };

    return;
  };

  render() {
    return (
      <header className={`c-header ${this.props.className || ""}`}>
        <FileUpload onChange={(event) => this.openFile(event)} />
      </header>
    );
  }
}
