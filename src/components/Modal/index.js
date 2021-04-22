// Modal.js
import React from "react";
import { createPortal } from "react-dom";
import Btn from "../Btn";
import "./style.sass";
import { ReactComponent as Close } from "../../assets/close.svg";
// We get hold of the div with the id modal that we have created in index.html
const modalRoot = document.getElementById("portal");
class Modal extends React.Component {
  constructor(props) {
    super(props);
    // We create an element div for this modal
    this.element = document.createElement("div");
  }
  // We append the created div to the div#modal
  componentDidMount() {
    modalRoot.appendChild(this.element);
  }
  /**
   * We remove the created div when this Modal Component is unmounted
   * Used to clean up the memory to avoid memory leak
   */
  componentWillUnmount() {
    modalRoot.removeChild(this.element);
  }

  render() {
    return createPortal(
      <div
        className={`c-modal ${this.props.medium && "c-modal--medium"} ${
          this.props.small && "c-modal--small"
        } ${this.props.top && "c-modal--top"}`}
      >
        <div
          className="c-modal__overlay"
          onClick={() => this.props.onClose()}
        />
        <div className="c-modal__window">
          <div className="c-modal__window-header">
            <div>
              <h1 className="c-modal__window-title">
                {this.props.title || ""}
              </h1>
            </div>
            <Btn
              circle
              className="c-modal__window-close"
              onClick={() => this.props.onClose()}
            >
              <Close></Close>
            </Btn>
          </div>

          <div className="c-modal__window-body">{this.props.children}</div>
        </div>
      </div>,
      this.element
    );
  }
}
export default Modal;
