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
            className="c-field__input"
            disabled={this.props.disabled}
            required={this.props.required}
            placeholder={this.props.placeholder}
            autoCapitalize={this.props.autocapitalize}
            autoComplete={this.props.autocomplete}
            autoCorrect={this.props.autocorrect}
            value={this.props.modelValue}
            readOnly={this.props.readonly}
            type={this.props.type || "text"}
            onChange={
              this.props.onChange &&
              ((str) => this.props.onChange(str.target.value))
            }
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
