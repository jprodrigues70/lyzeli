import { Component } from "react";
import { ReactComponent as Close } from "../../assets/close.svg";
import { ReactComponent as Loading } from "../../assets/loading.svg";
import "./style.sass";

export default class Tag extends Component {
  render() {
    const color = this.props.color ? `c-tag--${this.props.color}` : "";
    const active = this.props.active ? `c-tag--active` : "";
    const small = this.props.small ? `c-tag--small` : "";
    const outline = this.props.outline ? `c-tag--outline` : "";
    const block = this.props.block ? `c-tag--block` : "";
    const closeable = this.props.closeable ? `c-tag--closeable` : "";
    const twoCol = this.props["two-columns"] ? `c-tag--two-columns` : "";
    const classes = [
      "c-tag",
      this.props.className,
      color,
      active,
      small,
      outline,
      block,
      closeable,
      twoCol,
    ];
    return (
      <span
        ref={this.props.ref}
        className={classes.join(" ")}
        onClick={
          this.props.loading || this.props.disabled ? null : this.props.onClick
        }
        disabled={this.props.disabled || false}
      >
        <span className="c-tag__background"></span>
        <span className="c-tag__content">
          {this.props.loading ? <Loading /> : this.props.children}
        </span>
        {this.props.closeable && (
          <button className="c-tag__button" onClick={this.props.onClose}>
            <Close />
          </button>
        )}
      </span>
    );
  }
}
