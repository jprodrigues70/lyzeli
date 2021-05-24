import { Component } from "react";
import { ReactComponent as Loading } from "../../assets/loading.svg";
import "./style.sass";

export default class Btn extends Component {
  render() {
    const color = this.props.color ? `c-btn--${this.props.color}` : "";
    const active = this.props.active ? `c-btn--active` : "";
    const small = this.props.small ? `c-btn--small` : "";
    const outline = this.props.outline ? `c-btn--outline` : "";
    const block = this.props.block ? `c-btn--block` : "";
    const twoCol = this.props["two-columns"] ? `c-btn--two-columns` : "";

    return (
      <button
        ref={this.props.ref}
        className={`c-btn ${block} ${color} ${active} ${small} ${twoCol} ${outline} ${this.props.className}`}
        onClick={
          this.props.loading || this.props.disabled ? null : this.props.onClick
        }
        disabled={this.props.disabled || false}
      >
        <span className="c-btn__background"></span>
        <span className="c-btn__content">
          {this.props.loading ? <Loading /> : this.props.children}
        </span>
      </button>
    );
  }
}
