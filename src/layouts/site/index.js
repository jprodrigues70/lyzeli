import { Component } from "react";
import Header from "../../components/site/Header";
import "./style.sass";
import { Context } from "../../store";

export default class Painel extends Component {
  static contextType = Context;

  menuItems() {
    return this.context.state["database.keys"] || [];
  }

  render() {
    return (
      <div className="l-site">
        <Header />
        {this.props.children}
      </div>
    );
  }
}
