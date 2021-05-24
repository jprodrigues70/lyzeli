import { Component } from "react";
import "./style.sass";
import { ReactComponent as Upload } from "../../assets/upload.svg";
import { ReactComponent as Loading } from "../../assets/loading.svg";

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
          {this.props.loading ? (
            <Loading />
          ) : (
            <>
              <Upload></Upload>
              <span>SELECT FILE</span>
            </>
          )}
        </div>
      </div>
    );
  }
}
