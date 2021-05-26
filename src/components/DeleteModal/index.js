import { Component } from "react";
import { withRouter } from "react-router-dom";
import Modal from "../Modal";
import "./style.sass";
import { Context } from "../../store";

import Btn from "../Btn";

class DeleteModal extends Component {
  static contextType = Context;

  render() {
    const name = localStorage.getItem("name");
    return (
      <Modal
        title={`Remove dataset "${name}"`}
        small
        onClose={this.props.onClose}
        indestructible={this.props.loading}
      >
        <div className="c-delete-modal">
          <p>Are you sure you want to remove this dataset?</p>
          <div className="c-delete-modal__controls">
            <Btn
              disabled={this.props.loading}
              color="negative"
              onClick={this.props.onClose}
            >
              Cancel
            </Btn>
            <Btn
              loading={this.props.loading}
              color="positive"
              onClick={this.props.onPositive}
            >
              Yes, remove.
            </Btn>
          </div>
        </div>
      </Modal>
    );
  }
}
export default withRouter(DeleteModal);
