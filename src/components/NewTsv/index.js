import { Component } from "react";
import CsvExtractor from "../../plugins/CsvExtractor";
import Field from "../Field";
import FileUpload from "../FileUpload";
import Modal from "../Modal";
import "./style.sass";

import { format } from "date-fns";

export default class NewTsv extends Component {
  openFile = ({ target }) => {
    const reader = new FileReader();
    const { dispatch } = this.context;
    if (target.files && target.files.length) {
      dispatch({ action: "database.create", payload: {} });

      reader.readAsText(target.files[0]);

      reader.onload = () => {
        const database = new CsvExtractor(reader.result);

        dispatch({ action: "database.create", payload: database });

        this.form.current.reset();
      };
    }

    return;
  };

  render() {
    return (
      <Modal
        title="Import new dataset"
        small
        onClose={() => this.props.onClose()}
      >
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
          />
          <span>The questions are in which language?</span>
          <label className="c-new-tsv__radio">
            <input type="radio" name="language" checked />
            Portuguese
          </label>
          <label className="c-new-tsv__radio">
            <input type="radio" name="language" />
            English
          </label>
          <form ref={this.form}>
            <span>Select a .tsv file:</span>
            <FileUpload onChange={(event) => this.openFile(event)} />
          </form>
        </div>
      </Modal>
    );
  }
}
