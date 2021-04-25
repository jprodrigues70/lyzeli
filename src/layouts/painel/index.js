import { Component } from "react";
import Header from "../../components/Header";
import VerticalNav from "../../components/VerticalNav";
import key from "../../plugins/key";
import "./style.sass";
import { format } from "date-fns";
import { Context } from "../../store";

export default class Painel extends Component {
  static contextType = Context;

  menuItems() {
    return this.context.state["database.keys"] || [];
  }

  render() {
    const items = this.menuItems().map((i, index) => ({
      name: format(new Date(parseInt(i)), "d-MM-Y HH:mm:ss"),
      value: i,
      key: key(`ln-menu-${index}`),
    }));

    return (
      <div className="l-painel">
        <div className="l-painel__leftnav">
          <VerticalNav items={items} />
        </div>
        <div className="l-painel__right">
          <Header className="l-painel__header test" />
          <div className="l-painel__content">
            <div className="l-painel__content-advice">
              <p>
                All content added here is saved locally to localStorage. Be sure
                to remove the files using the side menu if you are on an
                untrusted computer.
              </p>
            </div>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}
