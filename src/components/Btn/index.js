import { Component } from "react";
import "./style.sass";

export default class Btn extends Component {
  render() {
    const color = this.props.color ? `c-btn--${this.props.color}` : "";
    const active = this.props.active ? `c-btn--active` : "";
    const small = this.props.small ? `c-btn--small` : "";

    return (
      <button
        ref={this.props.ref}
        className={`c-btn ${color} ${active} ${small}`}
        onClick={this.props.onClick}
      >
        <span className="c-btn__background"></span>
        <span className="c-btn__content">{this.props.children}</span>
      </button>
    );
  }
}
