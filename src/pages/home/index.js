import { Component } from "react";
import QuestionMapper from "../../components/QuestionMapper";
import RawData from "../../components/RawData";
import Suitable from "../../components/Suitable";
import { Context } from "../../store";
import Loading from "../../assets/loading.gif";
export default class Home extends Component {
  static contextType = Context;

  render() {
    const areas = [
      {
        key: "Presentation",
        content: () => <QuestionMapper />,
      },
      {
        key: "Raw data",
        content: () => <RawData></RawData>,
      },
    ];
    return (
      <>
        <img
          className={`${!this.context.state["loading.database"] && "v--hide"}`}
          src={Loading}
          alt="Loading..."
          style={{ display: "flex", margin: "auto", width: "150px" }}
        ></img>
        <Suitable
          className={`c-home ${
            this.context.state["loading.database"] && "v--hide"
          }`}
          areas={areas}
          no-re-click
        ></Suitable>
      </>
    );
  }
}

export const config = {
  name: "Home",
  layout: "painel",
  route: "/",
};
