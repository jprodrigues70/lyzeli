import { Component } from "react";
import key from "../../plugins/key";

import "./style.sass";

export default class SuitableContent extends Component {
  render() {
    return this.props.areas.map((item) => {
      const Content = item.content;
      const _key = item.key.split(":")[0].trim();

      return this.props.visible === _key ? (
        <div key={key(`suitable-${_key}`)}>
          <Content />
        </div>
      ) : null;
    });
  }
}
