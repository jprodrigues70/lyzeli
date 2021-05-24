import { Component } from "react";
import Btn from "../Btn";
import "./style.sass";
import { Context } from "../../store";

export default class Save extends Component {
  static contextType = Context;

  render() {
    const text =
      this.context.state["database.changes"] === 1 ? "change" : "changes";
    return (
      (this.context.state["database.changes"] && (
        <div className="c-save">
          <div className="c-save__body">
            {this.context.state["database.changes"]} unsaved {text}
            <Btn color="positive">SAVE</Btn>
          </div>
        </div>
      )) ||
      ""
    );
  }
}
