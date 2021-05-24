import { Component } from "react";
import { Context } from "../../store";
import Girl from "../../g10072.png";
import "./style.sass";

export default class Home extends Component {
  static contextType = Context;

  render() {
    return (
      <>
        <section className="c-landing__section c-landing__section--full-height c-landing__section--light-blue">
          <div className="c-landing__container c-landing__two-sides">
            <div className="c-landing__section-left">
              <h1 className="c-landing__title">
                Speed up the analysis of your survey responses
              </h1>
              <p className="c-landing__subtitle">
                Speed up the <b>qualitative</b> and <b>quantitative</b> analysis
                of your research data, see charts, word cloud and more!
              </p>
            </div>
            <div className="c-landing__section-right">
              <img
                className="c-landing__image"
                src={Girl}
                alt="Loading..."
              ></img>
            </div>
          </div>
        </section>
      </>
    );
  }
}

export const config = {
  name: "Home",
  layout: "site",
  route: "/",
};
