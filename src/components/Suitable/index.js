import { Component } from "react";
import key from "../../plugins/key";
import Btn from "../Btn";
import "./style.sass";

export default class Suitable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: !this.props["start-closed"] ? this.props.areas[0].key : null,
    };
  }
  showTab(visible) {
    if (this.state.visible === visible && !this.props["no-re-click"]) {
      this.setState({ visible: null });
      return;
    }
    this.setState({ visible });
  }

  render() {
    return (
      <div className="c-suitable">
        <div className="c-suitable__header">
          {this.props.areas.map((item) => {
            return (
              <Btn
                color={item.color}
                onClick={() => this.showTab(item.key)}
                key={item.key}
                active={item.key === this.state.visible}
              >
                {item.key}
              </Btn>
            );
          })}
        </div>
        <div className="c-suitable__body">
          {this.props.areas.map((item) => {
            return this.state.visible === item.key ? (
              <div key={key(`suitable-${item.key}`)}>{item.content}</div>
            ) : null;
          })}
        </div>
      </div>
    );
  }
}
