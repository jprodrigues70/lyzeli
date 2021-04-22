import { Component } from "react";
import QuestionMapper from "../../components/QuestionMapper";
import RawData from "../../components/RawData";
import Suitable from "../../components/Suitable";

export default class Home extends Component {
  render() {
    const areas = [
      {
        key: "Presentation",
        content: <QuestionMapper />,
      },
      {
        key: "Raw data",
        content: <RawData></RawData>,
      },
    ];
    return <Suitable className="c-home" areas={areas} no-re-click></Suitable>;
  }
}

export const config = {
  name: "Home",
  layout: "painel",
  route: "/",
};
