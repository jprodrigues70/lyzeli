import { Component } from "react";
import Field from "../../components/Field";

export default class Login extends Component {
  render() {
    return (
      <div>
        <Field />
      </div>
    )
  }
}

export const config = {
  name: 'Login',
  layout: 'clean',
  route: '/login'
}
