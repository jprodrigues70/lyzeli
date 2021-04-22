import { Component } from "react";
import "./style.sass";

export default class Field extends Component {
  render() {
    return (
      <div className="c-field">
        <label v-if="label" className="c-field__label">
          {this.props.label}
        </label>
        <fieldset className="c-field__fieldset">
          <input
            ref="input"
            className="c-field__input"
            disabled={this.props.disabled}
            required={this.props.required}
            placeholder={this.props.placeholder}
            autocapitalize={this.props.autocapitalize}
            autocomplete={this.props.autocomplete}
            autocorrect={this.props.autocorrect}
            value={this.props.modelValue}
            readonly={this.props.readonly}
            type={this.props.type || "text"}
          />
          {/* onInput="input" */}
        </fieldset>
        <p v-if="sublabel">
          <small>{this.props.sublabel}</small>
        </p>
      </div>
    );
  }
}
