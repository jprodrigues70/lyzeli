import { Component } from "react";
import { ReactComponent as Loading } from "../../assets/loading.svg";
import "./style.sass";

let i = 0;
export default class LoadingLogin extends Component {
  state = {
    phrase: "Wait",
  };
  interval = null;

  componentDidMount() {
    const phrases = [
      "Validating your access to GitHub",
      "Check the air",
      "Organizing the table",
      "Cleaning keyboard and mouse",
      "Calibrating the calculator",
      "Preparing graphics",
      "Getting emotion",
      "Lubricating the gears",
      "Warming up the engines",
      "Testing peripherals",
      "Validating storage",
      "Working hard for your comfort",
    ];

    this.interval = setInterval(() => {
      if (i < phrases.length) {
        this.setState({ phrase: phrases[i] });
        i++;
      }
    }, 700);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div className="c-loading-login">
        <div className="c-loading-login__body">
          <div>
            <div>{this.state.phrase}...</div>
            <Loading />
          </div>
        </div>
      </div>
    );
  }
}
