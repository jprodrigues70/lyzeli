import { Component } from "react";
import "./style.sass";
import { ReactComponent as Upload } from "../../assets/upload.svg";

export default class FileUpload extends Component {
  render() {
    return (
      <div className="c-file-upload">
        <input
          className="c-file-upload__input"
          type="file"
          name={this.props.name}
          required={this.props.required}
          onChange={(event) => this.props.onChange(event)}
        />
        <div className="c-file-upload__false-btn">
          <Upload></Upload>Upload a TSV file
        </div>
      </div>
    );
  }
}
