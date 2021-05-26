import { Component } from "react";
import Btn from "../Btn";
import SuitableContent from "./Content";
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
      <div className={`c-suitable ${this.props.className}`}>
        <div className="c-suitable__header">
          <div className="c-suitable__header-controls">
            {this.props.areas.map((item) => {
              const key = item.key.split(":")[0].trim();
              return (
                <Btn
                  color={item.color}
                  onClick={() => this.showTab(key)}
                  key={key}
                  active={key === this.state.visible}
                >
                  {item.key}
                </Btn>
              );
            })}
          </div>
          <div className="c-suitable__header-right-side">
            {this.props["right-side-of-header"]}
          </div>
        </div>
        <div className="c-suitable__body">
          <SuitableContent
            areas={this.props.areas}
            visible={this.state.visible}
          />
        </div>
      </div>
    );
  }
}
